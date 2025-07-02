import { Injectable, NotFoundException } from '@nestjs/common';
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
    return await this.repo.find({
      relations: ['employees', 'employees.peoples', 'factory'],
    });
  }

  async getOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['employees', 'employees.peoples', 'factory'],
    });
  }

  async generateData() {
    try {
      const employeeVacations = await this.getAll();
      const data: any[] = [];

      if (!employeeVacations)
        throw new NotFoundException('Ошибка поиска отпусков сотрудников');

      employeeVacations.map((item) => {
        const { employees, factory, ...defaultData } = item;

        const employeeName = `${employees.peoples?.firstName} ${employees.peoples?.middleName} ${employees.peoples?.lastName}`;
        const factoryTitle = factory.shortName;

        data.push({
          ...defaultData,
          factoryTitle,
          employeeName,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<EmployeesVacations>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return await this.repo.delete(id);
  }
}
