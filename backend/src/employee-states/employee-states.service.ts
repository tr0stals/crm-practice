import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeStates } from './employee-states.entity';

@Injectable()
export class EmployeeStatesService {
  constructor(
    @InjectRepository(EmployeeStates)
    private repository: Repository<EmployeeStates>,
  ) {}

  async create(data: Partial<EmployeeStates>): Promise<EmployeeStates> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<EmployeeStates[]> {
    return await this.repository.find({
      relations: ['employees']
    });
  }

  async findOne(id: number): Promise<EmployeeStates> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['employees']
    });
    if (!entity) {
      throw new NotFoundException(`Состояние сотрудника с id ${id} не найдено`);
    }
    return entity;
  }

  async update(id: number, data: Partial<EmployeeStates>): Promise<EmployeeStates> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
