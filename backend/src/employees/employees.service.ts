import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employees } from './employees.entity';
import { EmployeesDTO } from './dto/EmployeesDTO';
import { Peoples } from 'src/peoples/peoples.entity';
import { Professions } from 'src/professions/professions.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employees)
    private employeesRepository: Repository<Employees>,
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
  }
}