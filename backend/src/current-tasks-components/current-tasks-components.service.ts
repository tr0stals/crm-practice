import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentTasksComponents } from './current-tasks-components.entity';

@Injectable()
export class CurrentTasksComponentsService {
  constructor(
    @InjectRepository(CurrentTasksComponents)
    private readonly repo: Repository<CurrentTasksComponents>,
  ) {}

  async findAll() {
    return await this.repo.find({ relations: ['currentTask', 'component'] });
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['currentTask', 'component'],
    });
  }

  async generateData() {
    try {
      const currentTaskComponents = await this.findAll();
      const data: any[] = [];

      if (!currentTaskComponents)
        throw new NotFoundException('Ошибка поиска запчастей текущих задач');

      currentTaskComponents.map((item) => {
        const { component, currentTask, ...defaultData } = item;
        const componentTitle = component.title;
        const currentTaskTitle = currentTask.title;

        data.push({
          ...defaultData,
          currentTaskTitle,
          componentTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: Partial<CurrentTasksComponents>) {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async update(id: number, data: Partial<CurrentTasksComponents>) {
    await this.repo.update(id, data);
    return await this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
