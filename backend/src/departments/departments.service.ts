import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departments } from './departments.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Departments)
    private readonly repo: Repository<Departments>,
  ) {}

  create(data: Partial<Departments>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['employeeDepartments'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['employeeDepartments'] });
  }

  update(id: number, data: Partial<Departments>) {
    return this.repo.update(id, data);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
