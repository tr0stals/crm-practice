import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { StandTasks } from './stand_tasks.entity';
import { InjectRepository as InjectCurrentTasksRepository } from '@nestjs/typeorm';
import { CurrentTasks } from '../current_tasks/current_tasks.entity';

@Injectable()
export class StandTasksService {
  constructor(
    @InjectRepository(StandTasks)
    private repo: Repository<StandTasks>,
    @InjectCurrentTasksRepository(CurrentTasks)
    private currentTasksRepo: Repository<CurrentTasks>,
  ) {}

  async create(data: Partial<StandTasks>) {
    // Обработка поля isCompleted - если передана пустая строка или не передано, ставим false
    let isCompleted = data.isCompleted;
    if (isCompleted === null || isCompleted === undefined) {
      isCompleted = false;
    }

    // Если parentId не передан, явно ставим null
    const entity = this.repo.create({
      ...data,
      parentId: data.parentId ?? null,
      isCompleted: isCompleted,
    });
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
        const standTitle = stands.title;
        const professionTitle = professions.title;
        const componentTitle = components.title;

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

  async getAllByParent(parentId: number | null) {
    if (parentId === null) {
      return await this.repo.find({ where: { parentId: IsNull() }, relations: ['stands', 'professions', 'components'] });
    } else {
      return await this.repo.find({ where: { parentId }, relations: ['stands', 'professions', 'components'] });
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
    return await this.repo.delete(id);
  }

  async completeStandTask(id: number) {
    const standTask = await this.repo.findOne({ where: { id } });
    if (!standTask) throw new NotFoundException('Подзадача не найдена');
    standTask.isCompleted = true;
    await this.repo.save(standTask);

    // Проверяем, все ли подзадачи завершены
    if (standTask.parentId !== null) {
      const allSubtasks = await this.repo.find({ where: { parentId: standTask.parentId } });
      const allCompleted = allSubtasks.every(st => st.isCompleted);
      if (allCompleted) {
        // 1. Пометить главную задачу isCompleted = true
        const parentTask = await this.repo.findOne({ where: { id: standTask.parentId } });
        if (parentTask) {
          parentTask.isCompleted = true;
          await this.repo.save(parentTask);
        }
        // 2. Найти current_task, где standTaskId = parentId, и поменять статус на 3 (Завершена)
        // Для этого нужен репозиторий current_tasks
        // Импортируем и используем его
        // (добавим в конструктор: @InjectRepository(CurrentTasks) private currentTasksRepo: Repository<CurrentTasks>)
        // Ищем задачу
        if (this.currentTasksRepo) {
          const currentTask = await this.currentTasksRepo.findOne({ where: { standTasks: { id: standTask.parentId } }, relations: ['currentTaskStates', 'standTasks'] });
          if (currentTask) {
            currentTask.currentTaskStates = { id: 3 } as any;
            await this.currentTasksRepo.save(currentTask);
          }
        }
      }
    }
    return { success: true };
  }
}
