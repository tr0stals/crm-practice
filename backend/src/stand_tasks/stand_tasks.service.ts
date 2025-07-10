import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandTasks } from './stand_tasks.entity';

@Injectable()
export class StandTasksService {
  constructor(
    @InjectRepository(StandTasks)
    private repo: Repository<StandTasks>,
  ) {}

  async create(data: Partial<StandTasks>) {
    const entity = this.repo.create(data);
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
    const allSubtasks = await this.repo.find({ where: { parentId: standTask.parentId } });
    const allCompleted = allSubtasks.every(st => st.isCompleted);
    if (allCompleted) {
      // Найти статус "Завершена" для current_tasks
      // This part of the logic needs to be implemented if currentTaskStatesRepository and currentTasksRepository are available.
      // For now, it's commented out as they are not defined in the original file.
      // const completedState = await this.currentTaskStatesRepository.findOne({ where: [{ title: 'Завершена' }, { title: 'Завершена' }] });
      // if (completedState) {
      //   await this.currentTasksRepository.update(standTask.parentId, { currentTaskStates: completedState });
      // }
    }
    return { success: true };
  }
}
