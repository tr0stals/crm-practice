import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeDepartments } from './employee-departments.entity';

@Injectable()
export class EmployeeDepartmentsService {
  constructor(
    @InjectRepository(EmployeeDepartments)
    private readonly repo: Repository<EmployeeDepartments>,
  ) {}

  create(data: Partial<EmployeeDepartments>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['departments', 'employees'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['departments', 'employees'] });
  }

  update(id: number, data: Partial<EmployeeDepartments>) {
    return this.repo.update(id, data);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
