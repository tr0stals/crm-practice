import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { EmployeeDepartments } from './employee_departments.entity';
import { EmployeesDepartmentsDTO } from './dto/EmployeesDepartmentsDTO';
import { Employees } from 'src/employees/employees.entity';
import { Departments } from 'src/departments/departments.entity';

@Injectable()
export class EmployeeDepartmentsService {
  constructor(
    @InjectRepository(EmployeeDepartments)
    private readonly repo: Repository<EmployeeDepartments>,
    @InjectRepository(Employees)
    private readonly employeesRepository: Repository<Employees>,
    @InjectRepository(Departments)
    private readonly departmentsRepository: Repository<Departments>,
  ) {}

  async create(data: EmployeesDepartmentsDTO) {
    try {
      const employee = await this.employeesRepository.findOne({
        where: { id: data?.employeeId },
      });

      const department = await this.departmentsRepository.findOne({
        where: { id: data?.departmentId },
      });

      const entity = this.repo.create({
        employees: employee,
        departments: department,
      } as DeepPartial<EmployeeDepartments>);

      return await this.repo.save(entity);
    } catch (e) {
      throw new Error(e);
    }
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
        const departmentTitle = departments?.title;
        const employeeName = `${employees?.peoples?.firstName} ${employees?.peoples?.middleName} ${employees?.peoples?.lastName}`;

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
