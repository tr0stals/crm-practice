import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CurrentTasks } from './current-tasks.entity';
import { Employees } from 'src/employees/employees.entity';
import { CurrentTasksDTO } from './dto/CurrentTasksDTO';
import { CurrentTaskStates } from 'src/current-task-states/current-task-states.entity';
import { ShipmentsStands } from 'src/shipments-stands/shipments-stands.entity';
import { StandTasks } from 'src/stand-tasks/stand-tasks.entity';
import { Stands } from 'src/stands/stands.entity';

@Injectable()
export class CurrentTasksService {
  constructor(
    @InjectRepository(CurrentTasks)
    private currentTasksRepository: Repository<CurrentTasks>,
    @InjectRepository(Employees)
    private employeeRepository: Repository<Employees>,
    @InjectRepository(CurrentTaskStates)
    private currentTaskStatesRepository: Repository<CurrentTaskStates>,
    @InjectRepository(ShipmentsStands)
    private shipmentStandsRepository: Repository<ShipmentsStands>,
    @InjectRepository(StandTasks)
    private standTasksRepository: Repository<StandTasks>,
    @InjectRepository(Stands)
    private standRepository: Repository<Stands>,
  ) {}

  async create(data: CurrentTasksDTO) {
    const employee = await this.employeeRepository.findOne({
      where: { id: data.employeeId },
      relations: ['peoples'],
    });

    const currentTaskState = await this.currentTaskStatesRepository.findOne({
      where: { id: data.currentTaskStateId },
    });

    const stands = await this.standRepository.findOne({
      where: { id: data.standId },
      relations: ['standType', 'employees', 'employees.peoples'],
    });

    const standTask = await this.standTasksRepository.findOne({
      where: { id: data.standTaskId },
      relations: ['stands', 'professions', 'components'],
    });

    if (!employee || !currentTaskState || !stands || !standTask) {
      throw new Error('Related entities not found');
    }

    const entity: DeepPartial<CurrentTasks> =
      this.currentTasksRepository.create({
        deadline: data.deadline, // вот здесь подчеркивается ошибка
        currentTaskStates: currentTaskState,
        employees: employee,
        stands: stands,
        standTasks: standTask,
        title: data.title,
      });

    return await this.currentTasksRepository.save(entity);
  }

  async findAll(): Promise<CurrentTasks[]> {
    return await this.currentTasksRepository.find({
      relations: [
        'employees',
        'employees.peoples',
        'currentTaskStates',
        'stands',
        'standTasks',
      ],
    });
  }

  async generateData() {
    const currentTasks = await this.findAll();
    const data: any[] = [];

    if (!currentTasks)
      throw new NotFoundException('Ошибка поиска текущих задач');

    currentTasks.map((item) => {
      const {
        standTasks,
        employees,
        stands,
        currentTaskStates,
        ...defaultData
      } = item;
      console.log('item!!!!!!!', item);
      const standTaskTitle = standTasks.title;
      const employeesName = `${employees.peoples?.firstName} ${employees.peoples?.middleName} ${employees.peoples?.lastName}`;
      const standTitle = stands.title;
      const currentTaskStateTitle = currentTaskStates.title;

      data.push({
        ...defaultData,
        standTaskTitle,
        employeesName,
        standTitle,
        currentTaskStateTitle,
      });
    });

    return data;
  }

  async findOne(id: number): Promise<CurrentTasks> {
    const entity = await this.currentTasksRepository.findOne({
      where: { id },
      relations: ['employees', 'currentTaskStates', 'stands', 'standTasks'],
    });
    if (!entity) {
      throw new NotFoundException(`Текущая задача с ID ${id} не найдена`);
    }
    return entity;
  }

  async update(id: number, data: Partial<CurrentTasks>): Promise<CurrentTasks> {
    await this.findOne(id); // Проверяем существование
    await this.currentTasksRepository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.currentTasksRepository.delete(id);
  }
}
