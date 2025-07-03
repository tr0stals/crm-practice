import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeDepartments } from './employee_departments.entity';

@Injectable()
export class EmployeeDepartmentsService {
  constructor(
    @InjectRepository(EmployeeDepartments)
    private readonly repo: Repository<EmployeeDepartments>,
  ) {}

  async create(data: Partial<EmployeeDepartments>) {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async findAll() {
    return await this.repo.find({
      relations: ['departments', 'employees', 'employees.peoples'],
    });
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['departments', 'employees', 'employees.peoples'],
    });
  }

  async generateData() {
    try {
      const employeeDepartments = await this.findAll();
      const data: any[] = [];

      if (!employeeDepartments)
        throw new NotFoundException('Ошибка поиска отделов работников');

      employeeDepartments.map((item) => {
        const { departments, employees, ...defaultData } = item;
        const departmentTitle = departments.title;
        const employeeName = `${employees.peoples?.firstName} ${employees.peoples?.middleName} ${employees.peoples?.lastName}`;

        data.push({
          ...defaultData,
          departmentTitle,
          employeeName,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<EmployeeDepartments>) {
    return await this.repo.update(id, data);
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
