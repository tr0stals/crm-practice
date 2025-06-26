import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeesVacations } from './employees-vacations.entity';

@Injectable()
export class EmployeesVacationsService {
  constructor(
    @InjectRepository(EmployeesVacations)
    private repo: Repository<EmployeesVacations>,
  ) {}

  async create(data: Partial<EmployeesVacations>) {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async getAll() {
    return await this.repo.find({ relations: ['employees'] });
  }

  async getOne(id: number) {
    return await this.repo.findOne({ where: { id }, relations: ['employees'] });
  }

  async update(id: number, data: Partial<EmployeesVacations>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return await this.repo.delete(id);
  }
}
