<<<<<<< HEAD
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employees } from './employees.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
=======
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employees } from './employees.entity';
import { EmployeesDTO } from './dto/EmployeesDTO';
import { Peoples } from 'src/peoples/peoples.entity';
import { Professions } from 'src/professions/professions.entity';
>>>>>>> main

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employees)
    private employeesRepository: Repository<Employees>,
<<<<<<< HEAD
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
=======
    @InjectRepository(Peoples)
    private peoplesRepository: Repository<Peoples>,
    @InjectRepository(Professions)
    private professionsRepository: Repository<Professions>,
  ) {}

  async create(data: EmployeesDTO) {
    const people = await this.peoplesRepository.findOne({ where: { id: data.peopleId } });
    const profession = await this.professionsRepository.findOne({ where: { id: data.professionId } });
    const employee = this.employeesRepository.create({
      birthDate: data.birthDate,
      peoples: people,
      profession: profession,
    } as Partial<Employees>);
    return await this.employeesRepository.save(employee);
  }

  async getAll() {
    return await this.employeesRepository.find({ relations: ['peoples', 'profession'] });
  }

  async update(id: number, data: EmployeesDTO) {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) return null;
    const people = await this.peoplesRepository.findOne({ where: { id: data.peopleId } });
    const profession = await this.professionsRepository.findOne({ where: { id: data.professionId } });
    Object.assign(employee, data, { peoples: people, profession: profession });
    return await this.employeesRepository.save(employee);
  }

  async delete(id: number) {
    return await this.employeesRepository.delete(id);
>>>>>>> main
  }
}