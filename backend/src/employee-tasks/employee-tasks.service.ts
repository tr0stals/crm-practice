import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeTasks } from './employee-tasks.entity';

@Injectable()
export class EmployeeTasksService {
  constructor(
    @InjectRepository(EmployeeTasks)
    private readonly repo: Repository<EmployeeTasks>,
  ) {}

  create(data: Partial<EmployeeTasks>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['employees', 'shipments'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['employees', 'shipments'] });
  }

  update(id: number, data: Partial<EmployeeTasks>) {
    return this.repo.update(id, data);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
} 