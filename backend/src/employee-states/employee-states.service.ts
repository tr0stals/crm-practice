import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeStates } from './employee-states.entity';
import { CreateEmployeeStateDto } from './dto/create-employee-state.dto';
import { UpdateEmployeeStateDto } from './dto/update-employee-state.dto';

@Injectable()
export class EmployeeStatesService {
  constructor(
    @InjectRepository(EmployeeStates)
    private employeeStatesRepository: Repository<EmployeeStates>,
  ) {}

  async create(createEmployeeStateDto: CreateEmployeeStateDto): Promise<EmployeeStates> {
    const employeeState = this.employeeStatesRepository.create(createEmployeeStateDto);
    return await this.employeeStatesRepository.save(employeeState);
  }

  async findAll(): Promise<EmployeeStates[]> {
    return await this.employeeStatesRepository.find({
      relations: ['employees'],
    });
  }

  async findOne(id: number): Promise<EmployeeStates> {
    const employeeState = await this.employeeStatesRepository.findOne({
      where: { id },
      relations: ['employees'],
    });

    if (!employeeState) {
      throw new NotFoundException(`Состояние сотрудника с ID ${id} не найдено`);
    }

    return employeeState;
  }

  async update(id: number, updateEmployeeStateDto: UpdateEmployeeStateDto): Promise<EmployeeStates> {
    const employeeState = await this.findOne(id);
    Object.assign(employeeState, updateEmployeeStateDto);
    return await this.employeeStatesRepository.save(employeeState);
  }

  async remove(id: number): Promise<void> {
    const employeeState = await this.findOne(id);
    await this.employeeStatesRepository.remove(employeeState);
  }
}
