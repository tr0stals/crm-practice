import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskTypes } from './task-types.entity';

@Injectable()
export class TaskTypesService {
  constructor(
    @InjectRepository(TaskTypes)
    private readonly repository: Repository<TaskTypes>,
  ) {}

  async create(data: Partial<TaskTypes>): Promise<TaskTypes> {
    const taskType = this.repository.create(data);
    return await this.repository.save(taskType);
  }

  async findAll(): Promise<TaskTypes[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<TaskTypes> {
    const taskType = await this.repository.findOne({ where: { id } });
    if (!taskType) {
      throw new NotFoundException(`Задача с ID ${id} не найдена`);
    }
    return taskType;
  }

  async update(id: number, data: Partial<TaskTypes>): Promise<TaskTypes> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
} 