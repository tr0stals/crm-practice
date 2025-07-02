import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandTasksComponents } from './stand-tasks-components.entity';

@Injectable()
export class StandTasksComponentsService {
  constructor(
    @InjectRepository(StandTasksComponents)
    private readonly repo: Repository<StandTasksComponents>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['standTask', 'component'] });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['standTask', 'component'],
    });
  }

  async generateData() {
    try {
      const standTasksComponents = await this.findAll();
      const data: any[] = [];

      if (!standTasksComponents)
        throw new NotFoundException(
          'Ошибка при поиске компонентов задач стендов',
        );

      standTasksComponents.map((item) => {
        const { component, standTask, ...defaultData } = item;
        const componentTitle = component.title;
        const standTaskTitle = standTask.title;

        data.push({
          ...defaultData,
          standTaskTitle,
          componentTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  create(data: Partial<StandTasksComponents>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<StandTasksComponents>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
