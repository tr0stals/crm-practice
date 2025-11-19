import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { Professions } from 'src/professions/professions.entity';
import { CurrentTasksService } from 'src/current_tasks/current_tasks.service';
import { Stands } from 'src/stands/stands.entity';
import { StandTasksComponents } from 'src/stand_tasks_components/stand_tasks_components.entity';
import { Components } from 'src/components/components.entity';

@Injectable()
export class StandTasksService {
  constructor(
    @InjectRepository(StandTasks)
    private repo: Repository<StandTasks>,
    @InjectCurrentTasksRepository(CurrentTasks)
    private currentTasksRepo: Repository<CurrentTasks>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Professions)
    private professionsRepo: Repository<Professions>,
    @InjectRepository(StandTasksComponents)
    private standTasksComponentsRepo: Repository<StandTasksComponents>,
    private componentService: ComponentsService,
    private professionService: ProfessionsService,
    private standService: StandsService,

    private wsGateway: WsGateway,
    private currentTasksService: CurrentTasksService,
  ) {}

  async create(data: StandTasksDTO) {
    // Обработка поля isCompleted - если передана пустая строка или не передано, ставим false
    let isCompleted = data.isCompleted;
    if (isCompleted === null || isCompleted === undefined) {
      isCompleted = false;
    }
    const { componentId, professionId, standId, ...defaultData } = data;

    let component: Components | null = null;

    if (componentId)
      component = await this.componentService.findOne(componentId);

    const profession = await this.professionsRepo.findOne({
      where: { id: data.professionId },
    });
    const stand = await this.standService.findOne(standId);

    if (!profession || !stand)
      throw new NotFoundException('Одна из сущностей не найдена');

    // Если parentId не передан, явно ставим null
    const entity = this.repo.create({
      ...defaultData,
      parentId: data.parentId ?? null,
      isCompleted: isCompleted,
      stands: stand,
      professions: profession,
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
        const { stands, professions, components, ...defaultData } = item;
        const standTitle = stands?.title;
        const professionTitle = professions?.title;
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
      relations: ['stands', 'professions', 'components'],
    });
  }

  async getAllByStand(standId: number) {
    try {
      const res = await this.repo.find({
        where: {
          stands: {
            id: standId,
          },
        },
        relations: ['stands', 'professions', 'components'],
      });

      return res;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getAllByParent(parentId: number | null) {
    if (parentId === null) {
      return await this.repo.find({
        where: { parentId: IsNull() },
        relations: ['stands', 'professions', 'components'],
      });
    } else {
      return await this.repo.find({
        where: { parentId },
        relations: ['stands', 'professions', 'components'],
      });
    }
  }

  async getOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['stands', 'professions', 'components'],
    });
  }

  async update(id: number, data: Partial<StandTasks>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    try {
      await this.repo.delete(id);
    } catch (e: any) {
      if (e.code === 'ER_ROW_IS_REFERENCED_2') {
        const match = e.sqlMessage.match(/`([^`]+)`\.`([^`]+)`/);
        let tableName = match ? match[2] : '';

        throw new HttpException(
          {
            message: `Невозможно удалить запись. Есть связанные записи в таблице "${tableName}". Удалите их сначала.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw e;
    }
  }

  // async completeStandTask(id: number) {
  //   const standTask = await this.repo.findOne({
  //     where: { id },
  //     relations: ['stands', 'components'],
  //   });
  //   if (!standTask) throw new NotFoundException('Подзадача не найдена');

  //   await this.repo.save(standTask);

  //   // Отправляем уведомление о завершении подзадачи
  //   if (standTask.parentId !== null) {
  //     // Находим текущую задачу через parentId
  //     const currentTask = await this.currentTasksRepo.findOne({
  //       where: { standTasks: { id: standTask.parentId } },
  //       relations: [
  //         'employees',
  //         'employees.users',
  //         'employees.peoples',
  //         'stands',
  //         'standTasks',
  //       ],
  //     });

  //     if (
  //       currentTask?.shipmentStands.stands.employees?.users &&
  //       currentTask.shipmentStands.stands.employees.users.length > 0
  //     ) {
  //       const user = currentTask.shipmentStands.stands.employees.users[0];
  //       const message = `Подзадача "${standTask.title}" на стенде "${standTask.stands?.title}" завершена`;

  //       console.log(
  //         `[NOTIFICATION] Отправляем уведомление о подзадаче пользователю ${user.id}: ${message}`,
  //       );
  //       this.wsGateway.sendNotification(
  //         user.id.toString(),
  //         message,
  //         'subtask_completed',
  //       );
  //     } else {
  //       console.log(
  //         `[NOTIFICATION] Не найден пользователь для уведомления о подзадаче`,
  //       );
  //     }
  //   }

  //   // Проверяем, все ли подзадачи завершены
  //   if (standTask.parentId !== null) {
  //     const allSubtasks = await this.repo.find({
  //       where: { parentId: standTask.parentId },
  //     });
  //     const allCompleted = allSubtasks.every((st) => st.isCompleted);
  //     if (allCompleted) {
  //       // 1. Пометить главную задачу isCompleted = true
  //       const parentTask = await this.repo.findOne({
  //         where: { id: standTask.parentId },
  //       });
  //       if (parentTask) {
  //         parentTask.isCompleted = true;
  //         await this.repo.save(parentTask);
  //       }
  //       // 2. Найти current_task, где standTaskId = parentId, и поменять статус на 3 (Завершена)
  //       if (this.currentTasksRepo) {
  //         const currentTask = await this.currentTasksRepo.findOne({
  //           where: { standTasks: { id: standTask.parentId } },
  //           relations: [
  //             'currentTaskStates',
  //             'standTasks',
  //             'employees',
  //             'employees.users',
  //             'employees.peoples',
  //             'stands',
  //           ],
  //         });
  //         if (currentTask) {
  //           // Вызываем метод completeTask для корректного завершения задачи
  //           await this.currentTasksService.completeTask(currentTask.id);
  //         }
  //       }
  //     }
  //   }
  //   return { success: true };
  // }

  async getTree() {
    try {
      const stands = await this.standService.findAll();
      const standTasks = await this.getAll();
      const standTasksComponents = await this.standTasksComponentsRepo.find({
        relations: ['standTask', 'component'],
      });

      // 🔹 вспомогательная функция — возвращает список компонентов для конкретной задачи
      const getComponentsForTask = (taskId: number) => {
        const comps = standTasksComponents.filter(
          (item) => item.standTask?.id === taskId,
        );

        if (comps.length === 0) return [];

        // группируем по компоненту, суммируем количество
        const grouped = new Map<number, { title: string; total: number }>();
        for (const item of comps) {
          const compId = item.component?.id;
          if (!compId) continue;

          const count = Number(item.componentCount ?? 0);
          const existing = grouped.get(compId);

          if (existing) {
            grouped.set(compId, {
              title: existing.title,
              total: existing.total + count,
            });
          } else {
            grouped.set(compId, {
              title: item.component?.title ?? 'Без названия',
              total: count,
            });
          }
        }

        // возвращаем массив дочерних узлов компонентов
        return Array.from(grouped.entries()).map(([compId, info]) => ({
          id: compId,
          name: `Компонент: ${info.title} | Кол-во: ${info.total}`,
          nodeType: 'stand_tasks_components',
          children: [],
        }));
      };

      // 🔹 рекурсивная функция для построения задач
      const buildTaskTree = (tasks: any[], parentId: number | null = null) => {
        return tasks
          .filter((t) => (t.parentId ?? null) === parentId)
          .map((task) => {
            const subTasks = buildTaskTree(tasks, task.id);
            const components = getComponentsForTask(task.id);

            // если нет подзадач и нет компонентов — children будет []
            const children =
              subTasks.length > 0 || components.length > 0
                ? [...subTasks, ...components]
                : [];

            console.log('TASK!!!!', task);

            return {
              id: task.id,
              name: `Задача: ${task.title} | Профессия: ${task.professions?.title ?? 'Без профессии'}`,
              nodeType: 'stand_tasks',
              children,
            };
          });
      };

      // 🔹 верхний уровень — стенды
      const tree = stands.map((stand: Stands) => {
        const standTaskList = standTasks.filter(
          (task) => task.stands?.id === stand.id,
        );

        return {
          id: stand.id,
          name: `Стенд: ${stand.title} | ${stand.standType?.title ?? 'Без типа'}`,
          nodeType: 'stands',
          children: buildTaskTree(standTaskList),
        };
      });

      return { name: 'Задачи стенда', children: tree };
    } catch (e) {
      throw new Error(`Ошибка при построении дерева задач: ${e.message}`);
    }
  }
}
