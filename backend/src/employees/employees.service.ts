import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employees } from './employees.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employees)
    private employeesRepository: Repository<Employees>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employees> {
    const employee = this.employeesRepository.create(createEmployeeDto);
    return await this.employeesRepository.save(employee);
  }

  async findAll(): Promise<Employees[]> {
    return await this.employeesRepository.find({
      relations: ['peoples', 'employeeStates'],
    });
  }

  async findOne(id: number): Promise<Employees> {
    const employee = await this.employeesRepository.findOne({
      where: { id },
      relations: ['peoples', 'employeeStates'],
    });

    if (!employee) {
      throw new NotFoundException(`Сотрудник с ID ${id} не найден`);
    }

    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employees> {
    const employee = await this.findOne(id);
    Object.assign(employee, updateEmployeeDto);
    return await this.employeesRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeesRepository.remove(employee);
  }
}