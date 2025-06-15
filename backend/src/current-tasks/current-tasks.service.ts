import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentTasks } from './current-tasks.entity';

@Injectable()
export class CurrentTasksService {
  constructor(
    @InjectRepository(CurrentTasks)
    private repository: Repository<CurrentTasks>,
  ) {}

  async create(data: Partial<CurrentTasks>): Promise<CurrentTasks> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<CurrentTasks[]> {
    return await this.repository.find({
      relations: ['employee', 'task']
    });
  }

  async findOne(id: number): Promise<CurrentTasks> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['employee', 'task']
    });
    if (!entity) {
      throw new NotFoundException(`Текущая задача с ID ${id} не найдена`);
    }
    return entity;
  }

  async update(id: number, data: Partial<CurrentTasks>): Promise<CurrentTasks> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
} 