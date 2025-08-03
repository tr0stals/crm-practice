import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, DeepPartial } from 'typeorm';
import { StandTasks } from './stand_tasks.entity';
import { InjectRepository as InjectCurrentTasksRepository } from '@nestjs/typeorm';
import { CurrentTasks } from '../current_tasks/current_tasks.entity';
import { StandTasksDTO } from './dto/StandTasksDTO';
import { ComponentsService } from 'src/components/components.service';
import { ProfessionsService } from 'src/professions/professions.service';
import { StandsService } from 'src/stands/stands.service';
import { WsGateway } from 'src/websocket/ws.gateway';
import { User } from 'src/user/user.entity';
import { ProfessionRights } from 'src/profession_rights/profession_rights.entity';

@Injectable()
export class StandTasksService {
  constructor(
    @InjectRepository(StandTasks)
    private repo: Repository<StandTasks>,
    @InjectCurrentTasksRepository(CurrentTasks)
    private currentTasksRepo: Repository<CurrentTasks>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ProfessionRights)
    private professionRights: Repository<ProfessionRights>,
    private componentService: ComponentsService,
    private professionService: ProfessionsService,
    private standService: StandsService,

    private wsGateway: WsGateway,
  ) {}

  async create(data: StandTasksDTO) {
    // Обработка поля isCompleted - если передана пустая строка или не передано, ставим false
    let isCompleted = data.isCompleted;
    if (isCompleted === null || isCompleted === undefined) {
      isCompleted = false;
    }
    const { componentId, professionId, standId, ...defaultData } = data;
    const component = await this.componentService.findOne(componentId);
    const professionRight = await this.professionRights.findOne({
      where: { professions: { id: data.professionId } },
      relations: ['professions', 'rights'],
    });
    const stand = await this.standService.findOne(standId);

    if (!component || !professionRight || !stand)
      throw new NotFoundException('Одна из сущностей не найдена');

    // Если parentId не передан, явно ставим null
    const entity = this.repo.create({
      ...defaultData,
      parentId: data.parentId ?? null,
      isCompleted: isCompleted,
      stands: stand,
      professionRights: professionRight,
      components: component,
    } as DeepPartial<StandTasks>);

    return await this.repo.save(entity);
  }

  async generateData() {
    try {
      const tasks = await this.getAll();
      const data: any[] = [];

      if (!tasks)
        throw new NotFoundException('Ошибка при поиске задач стендов');

      tasks.map((item) => {
        const { stands, professionRights, components, ...defaultData } = item;
        const standTitle = stands?.title;
        const professionTitle = professionRights?.professions?.title;
        const componentTitle = components?.title;

        data.push({
          ...defaultData,
          standTitle,
          professionTitle,
          componentTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getAll() {
    return await this.repo.find({
      relations: [
        'stands',
        'professionRights',
        'professionRights.professions',
        'professionRights.rights',
        'components',
      ],
    });
  }

  async getAllByParent(parentId: number | null) {
    if (parentId === null) {
      return await this.repo.find({
        where: { parentId: IsNull() },
        relations: [
          'stands',
          'professionRights',
          'professionRights.professions',
          'professionRights.rights',
          'components',
        ],
      });
    } else {
      return await this.repo.find({
        where: { parentId },
        relations: [
          'stands',
          'professionRights',
          'professionRights.professions',
          'professionRights.rights',
          'components',
        ],
      });
    }
  }

  async getOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: [
        'stands',
        'professionRights',
        'professionRights.professions',
        'professionRights.rights',
        'components',
      ],
    });
  }

  async update(id: number, data: Partial<StandTasks>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return await this.repo.delete(id);
  }

  async completeStandTask(id: number) {
    const standTask = await this.repo.findOne({
      where: { id },
      relations: ['stands', 'components'],
    });
    if (!standTask) throw new NotFoundException('Подзадача не найдена');

    standTask.isCompleted = true;
    await this.repo.save(standTask);

    // Отправляем уведомление о завершении подзадачи
    if (standTask.parentId !== null) {
      // Находим текущую задачу через parentId
      const currentTask = await this.currentTasksRepo.findOne({
        where: { standTasks: { id: standTask.parentId } },
        relations: [
          'employees',
          'employees.users',
          'employees.peoples',
          'stands',
          'standTasks',
        ],
      });

      if (
        currentTask?.employees?.users &&
        currentTask.employees.users.length > 0
      ) {
        const user = currentTask.employees.users[0];
        const message = `Подзадача "${standTask.title}" на стенде "${standTask.stands?.title}" завершена`;

        console.log(
          `[NOTIFICATION] Отправляем уведомление о подзадаче пользователю ${user.id}: ${message}`,
        );
        this.wsGateway.sendNotification(
          user.id.toString(),
          message,
          'subtask_completed',
        );
      } else {
        console.log(
          `[NOTIFICATION] Не найден пользователь для уведомления о подзадаче`,
        );
      }
    }

    // Проверяем, все ли подзадачи завершены
    if (standTask.parentId !== null) {
      const allSubtasks = await this.repo.find({
        where: { parentId: standTask.parentId },
      });
      const allCompleted = allSubtasks.every((st) => st.isCompleted);
      if (allCompleted) {
        // 1. Пометить главную задачу isCompleted = true
        const parentTask = await this.repo.findOne({
          where: { id: standTask.parentId },
        });
        if (parentTask) {
          parentTask.isCompleted = true;
          await this.repo.save(parentTask);
        }
        // 2. Найти current_task, где standTaskId = parentId, и поменять статус на 3 (Завершена)
        if (this.currentTasksRepo) {
          const currentTask = await this.currentTasksRepo.findOne({
            where: { standTasks: { id: standTask.parentId } },
            relations: [
              'currentTaskStates',
              'standTasks',
              'employees',
              'employees.users',
              'employees.peoples',
              'stands',
            ],
          });
          if (currentTask) {
            // Отправляем уведомление о завершении всей задачи
            if (
              currentTask.employees?.users &&
              currentTask.employees.users.length > 0
            ) {
              const user = currentTask.employees.users[0];
              const message = `Задача "${currentTask.title}" на стенде "${currentTask.stands?.title}" полностью завершена`;

              console.log(
                `[NOTIFICATION] Отправляем уведомление о завершении задачи пользователю ${user.id}: ${message}`,
              );
              this.wsGateway.sendNotification(
                user.id.toString(),
                message,
                'task_completed',
              );
            } else {
              console.log(
                `[NOTIFICATION] Не найден пользователь для уведомления о завершении задачи`,
              );
            }

            currentTask.currentTaskStates = { id: 3 } as any;
            await this.currentTasksRepo.save(currentTask);
          }
        }
      }
    }
    return { success: true };
  }
}
