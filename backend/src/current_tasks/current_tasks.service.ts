import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CurrentTasks } from './current_tasks.entity';
import { Employees } from 'src/employees/employees.entity';
import { CurrentTasksDTO } from './dto/CurrentTasksDTO';
import { CurrentTaskStates } from 'src/current_task_states/current_task_states.entity';
import { ShipmentsStands } from 'src/shipments_stands/shipments_stands.entity';
import { StandTasks } from 'src/stand_tasks/stand_tasks.entity';
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

  async startTask(taskId: number, employeeId: number) {
    const task = await this.currentTasksRepository.findOne({ where: { id: taskId }, relations: ['currentTaskStates'] });
    if (!task) throw new Error('Задача не найдена');
    // Назначаем сотрудника
    task.employees = { id: employeeId } as any;
    // Меняем статус на "Выполняется"
    // Найти статус "Выполняется" в таблице current_task_states
    const inProgressState = await this.currentTaskStatesRepository.findOne({ where: [{ title: 'Выполняется' }, { title: 'Выполняется' }] });
    if (inProgressState) {
      task.currentTaskStates = inProgressState;
    }
    return await this.currentTasksRepository.save(task);
  }

  async completeTask(taskId: number) {
    const task = await this.currentTasksRepository.findOne({ where: { id: taskId }, relations: ['currentTaskStates'] });
    if (!task) throw new Error('Задача не найдена');
    // Меняем статус на "Завершена"
    const completedState = await this.currentTaskStatesRepository.findOne({ where: [{ title: 'Завершена' }, { title: 'Завершена' }] });
    if (completedState) {
      task.currentTaskStates = completedState;
    }
    return await this.currentTasksRepository.save(task);
  }

  async getAllTaskTitles(): Promise<{id: number, title: string}[]> {
    const tasks = await this.findAll();
    return tasks.map(task => ({ id: task.id, title: task.title }));
  }

  // Новый метод: дерево для всех (директор/админ)
  async getCurrentTasksTreeForAll(): Promise<any> {
    const tasks = await this.currentTasksRepository.find({
      relations: [
        'employees',
        'employees.peoples',
        'currentTaskStates',
        'stands',
        'standTasks',
        'standTasks.components',
      ],
    });
    // Группировка по дедлайну и названию задачи
    const deadlineMap = new Map<string, Map<string, any[]>>();
    for (const task of tasks) {
      const deadline = task.deadline
        ? (typeof task.deadline === 'string'
            ? task.deadline
            : (task.deadline as Date).toISOString().split('T')[0])
        : 'Без даты';
      const title = task.title || 'Без названия';
      if (!deadlineMap.has(deadline)) deadlineMap.set(deadline, new Map());
      const titleMap = deadlineMap.get(deadline)!;
      if (!titleMap.has(title)) titleMap.set(title, []);
      titleMap.get(title)!.push(task);
    }
    const children = Array.from(deadlineMap.entries()).map(([deadline, titleMap]) => ({
      name: deadline,
      children: Array.from(titleMap.entries()).map(([title, tasks]) => ({
        name: title,
        children: tasks.map(task => {
          const standTask = task.standTasks;
          const manufactureTime = standTask?.manufactureTime ? (typeof standTask.manufactureTime === 'string' ? standTask.manufactureTime : (standTask.manufactureTime as Date).toISOString().split('T')[0]) : '';
          return {
            id: task.id,
            name: [
              `${task.employees?.peoples?.lastName || ''} ${task.employees?.peoples?.firstName || ''} ${task.employees?.peoples?.middleName || ''}`.trim() || 'Без сотрудника',
              `Стенд: ${task.stands?.title}`,
              `Задача стенда: ${standTask?.title}`,
              `Состояние: ${task.currentTaskStates?.title}`,
              `Время изготовления: ${manufactureTime}`,
            ].filter(Boolean).join(' | '),
            employee: `${task.employees?.peoples?.lastName || ''} ${task.employees?.peoples?.firstName || ''} ${task.employees?.peoples?.middleName || ''}`.trim() || 'Без сотрудника',
            stand: task.stands?.title || '',
            standTask: standTask?.title || '',
            state: task.currentTaskStates?.title || '',
            manufactureTime,
            children: [],
          };
        })
      }))
    }));
    return { name: 'Текущие задачи', children };
  }

  // Новый метод: дерево только для сотрудника
  async getCurrentTasksTreeForEmployee(employeeId: number): Promise<any> {
    const tasks = await this.currentTasksRepository.find({
      where: { employees: { id: employeeId } },
      relations: [
        'employees',
        'employees.peoples',
        'currentTaskStates',
        'stands',
        'standTasks',
        'standTasks.components',
      ],
    });
    // Группировка: состояние -> дата -> название задачи
    const stateMap = new Map<string, Map<string, Map<string, any[]>>>();
    for (const task of tasks) {
      const state = task.currentTaskStates?.title || 'Без состояния';
      const deadline = task.deadline
        ? (typeof task.deadline === 'string'
            ? task.deadline
            : (task.deadline as Date).toISOString().split('T')[0])
        : 'Без даты';
      const title = task.title || 'Без названия';
      if (!stateMap.has(state)) stateMap.set(state, new Map());
      const deadlineMap = stateMap.get(state)!;
      if (!deadlineMap.has(deadline)) deadlineMap.set(deadline, new Map());
      const titleMap = deadlineMap.get(deadline)!;
      if (!titleMap.has(title)) titleMap.set(title, []);
      titleMap.get(title)!.push(task);
    }
    const children = Array.from(stateMap.entries()).map(([state, deadlineMap]) => ({
      name: state,
      children: Array.from(deadlineMap.entries()).map(([deadline, titleMap]) => ({
        name: deadline,
        children: Array.from(titleMap.entries()).map(([title, tasks]) => ({
          name: title,
          children: tasks.map(task => {
            const standTask = task.standTasks;
            const componentTitle = standTask?.components?.title || '';
            const componentOutCount = standTask?.componentOutCount != null ? standTask.componentOutCount : '';
            const manufactureTime = standTask?.manufactureTime ? (typeof standTask.manufactureTime === 'string' ? standTask.manufactureTime : (standTask.manufactureTime as Date).toISOString().split('T')[0]) : '';
            return {
              id: task.id,
              name: [
                `Стенд: ${task.stands?.title}`,
                `Задача стенда: ${standTask?.title}`,
                `Компонент: ${componentTitle}`,
                `Кол-во: ${componentOutCount}`,
                `Время изготовления: ${manufactureTime}`,
              ].filter(Boolean).join(' | '),
              state: task.currentTaskStates?.title || '',
              stand: task.stands?.title || '',
              standTask: standTask?.title || '',
              component: componentTitle,
              componentOutCount,
              manufactureTime,
              children: [],
            };
          })
        }))
      }))
    }));
    return { name: 'Мои задачи', children };
  }
}
