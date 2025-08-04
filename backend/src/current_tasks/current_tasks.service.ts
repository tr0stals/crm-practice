import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, IsNull } from 'typeorm';
import { CurrentTasks } from './current_tasks.entity';
import { Employees } from 'src/employees/employees.entity';
import { CurrentTasksDTO } from './dto/CurrentTasksDTO';
import { CurrentTaskStates } from 'src/current_task_states/current_task_states.entity';
import { ShipmentsStands } from 'src/shipments_stands/shipments_stands.entity';
import { StandTasks } from 'src/stand_tasks/stand_tasks.entity';
import { Stands } from 'src/stands/stands.entity';
import { WsGateway } from 'src/websocket/ws.gateway';
import { User } from 'src/user/user.entity';
import { CurrentTaskStatesLogService } from 'src/current_task_states_log/current_task_states_log.service';

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
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private wsGateway: WsGateway,
    private currentTaskStatesLogService: CurrentTaskStatesLogService,
  ) {}

  async create(data: CurrentTasksDTO): Promise<CurrentTasks> {
    // Проверим всех пользователей в базе
    // const allUsers = await this.userRepository.find({
    //   relations: ['employees', 'employees.peoples']
    // });
    // console.log(`[DEBUG] Всего пользователей в базе: ${allUsers.length}`);
    // allUsers.forEach(user => {
    //   console.log(`[DEBUG] Пользователь ID: ${user.id}, userName: ${user.userName}, employeeId: ${user.employees?.id}`);
    // });

    const employee = await this.employeeRepository.findOne({
      where: { id: data.employeeId },
      relations: ['peoples', 'users'],
    });

    // console.log(`[DEBUG] Найден сотрудник:`, employee ? {
    //   id: employee.id,
    //   hasPeoples: !!employee.peoples,
    //   hasUsers: !!employee.users,
    //   usersCount: employee.users?.length || 0
    // } : 'null');

    const currentTaskState = await this.currentTaskStatesRepository.findOne({
      where: { id: data.currentTaskStateId },
    });

    const stands = await this.standRepository.findOne({
      where: { id: data.standId },
      relations: ['standType', 'employees', 'employees.peoples'],
    });

    const standTask = await this.standTasksRepository.findOne({
      where: { id: data.standTaskId },
      relations: ['stands', 'professionRights', 'professionRights.professions', 'components'],
    });

    if (!employee || !currentTaskState || !stands || !standTask) {
      throw new Error('Related entities not found');
    }

    // Попробуем альтернативный способ получения сотрудника с пользователями -- запасной вариант
    // if (!employee?.users || employee.users.length === 0) {
    //   console.log(`[DEBUG] Пробуем альтернативный способ получения сотрудника с пользователями`);
    //   const employeeWithUsers = await this.employeeRepository
    //     .createQueryBuilder('employee')
    //     .leftJoinAndSelect('employee.users', 'users')
    //     .leftJoinAndSelect('employee.peoples', 'peoples')
    //     .where('employee.id = :id', { id: data.employeeId })
    //     .getOne();

    //   if (employeeWithUsers?.users && employeeWithUsers.users.length > 0) {
    //     console.log(`[DEBUG] Найден сотрудник с пользователями через QueryBuilder: ${employeeWithUsers.users.length} пользователей`);
    //     const user = employeeWithUsers.users[0];
    //     const message = `Вам назначена новая задача: "${data.title}" на стенде "${stands.title}". Дедлайн: ${data.deadline}`;

    //     console.log(`[NOTIFICATION] Отправляем уведомление пользователю ${user.id}: ${message}`);
    //     this.wsGateway.sendNotification(user.id.toString(), message, 'task_assigned');
    //   } else {
    //     console.log(`[DEBUG] Сотрудник не найден через QueryBuilder или у него нет пользователей`);
    //   }
    // }

    // Отправляем уведомление до создания entity
    if (employee.users && employee.users.length > 0) {
      const user = employee.users[0]; // Берем первого пользователя
      const employeeName =
        `${employee.peoples?.lastName || ''} ${employee.peoples?.firstName || ''} ${employee.peoples?.middleName || ''}`.trim();
      const message = `Вам назначена новая задача: "${data.title}" на стенде "${stands.title}". Дедлайн: ${data.deadline}`;

      console.log(
        `[NOTIFICATION] Отправляем уведомление пользователю ${user.id}: ${message}`,
      );
      this.wsGateway.sendNotification(
        user.id.toString(),
        message,
        'task_assigned',
      );
    } else {
      console.log(
        `[NOTIFICATION] У сотрудника ${employee.id} нет пользователей для уведомлений`,
      );
      console.log(`[DEBUG] employee.users:`, employee.users);

      // Попробуем найти пользователя напрямую
      const directUser = await this.userRepository.findOne({
        where: { employees: { id: employee.id } },
      });

      if (directUser) {
        const employeeName =
          `${employee.peoples?.lastName || ''} ${employee.peoples?.firstName || ''} ${employee.peoples?.middleName || ''}`.trim();
        const message = `Вам назначена новая задача: "${data.title}" на стенде "${stands.title}". Дедлайн: ${data.deadline}`;
        console.log(
          `[NOTIFICATION] Найден пользователь напрямую: ${directUser.id}, отправляем уведомление`,
        );
        this.wsGateway.sendNotification(
          directUser.id.toString(),
          message,
          'task_assigned',
        );
      } else {
        console.log(
          `[DEBUG] Пользователь не найден даже напрямую для сотрудника ${employee.id}`,
        );
      }
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

    const savedTask = await this.currentTasksRepository.save(entity);
    
    // Логируем первоначальный статус задачи
    await this.currentTaskStatesLogService.logStateChange(savedTask.id, currentTaskState.id);
    
    return savedTask;
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

      const standTaskTitle = standTasks?.title;
      const employeesName = `${employees.peoples?.firstName} ${employees.peoples?.middleName} ${employees.peoples?.lastName}`;
      const standTitle = stands?.title;
      const currentTaskStateTitle = currentTaskStates?.title;

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
    const existingTask = await this.findOne(id); // Проверяем существование и получаем текущее состояние
    
    // Логируем изменение статуса, если оно произошло
    if (data.currentTaskStates && data.currentTaskStates.id !== existingTask.currentTaskStates?.id) {
      await this.currentTaskStatesLogService.logStateChange(id, data.currentTaskStates.id);
    }
    
    await this.currentTasksRepository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.currentTasksRepository.delete(id);
  }

  async startTask(taskId: number, employeeId: number) {
    const task = await this.currentTasksRepository.findOne({
      where: { id: taskId },
      relations: [
        'currentTaskStates',
        'employees',
        'employees.users',
        'employees.peoples',
        'stands',
      ],
    });
    if (!task) throw new Error('Задача не найдена');

    // Отправляем уведомление о начале задачи
    if (task.employees?.users && task.employees.users.length > 0) {
      const user = task.employees.users[0];
      const employeeName =
        `${task.employees.peoples?.lastName || ''} ${task.employees.peoples?.firstName || ''} ${task.employees.peoples?.middleName || ''}`.trim();
      const message = `Задача "${task.title}" на стенде "${task.stands?.title}" начата`;

      this.wsGateway.sendNotification(
        user.id.toString(),
        message,
        'task_started',
      );
    }

    // Меняем статус на "Выполняется"
    const inProgressState = await this.currentTaskStatesRepository.findOne({
      where: [{ title: 'Выполняется' }, { title: 'Выполняется' }],
    });
    if (inProgressState) {
      // Логируем изменение статуса
      await this.currentTaskStatesLogService.logStateChange(taskId, inProgressState.id);
      task.currentTaskStates = inProgressState;
    }
    return await this.currentTasksRepository.save(task);
  }

  async completeTask(taskId: number) {
    const task = await this.currentTasksRepository.findOne({
      where: { id: taskId },
      relations: [
        'currentTaskStates',
        'employees',
        'employees.users',
        'employees.peoples',
        'stands',
      ],
    });
    if (!task) throw new Error('Задача не найдена');

    // Отправляем уведомление о завершении задачи
    if (task.employees?.users && task.employees.users.length > 0) {
      const user = task.employees.users[0];
      const message = `Задача "${task.title}" на стенде "${task.stands?.title}" завершена`;

      this.wsGateway.sendNotification(
        user.id.toString(),
        message,
        'task_completed',
      );
    }

    // Меняем статус на "Завершена"
    const completedState = await this.currentTaskStatesRepository.findOne({
      where: [{ title: 'Завершена' }, { title: 'Завершена' }],
    });
    if (completedState) {
      // Логируем изменение статуса
      await this.currentTaskStatesLogService.logStateChange(taskId, completedState.id);
      task.currentTaskStates = completedState;
    }
    return await this.currentTasksRepository.save(task);
  }

  async getAllTaskTitles(): Promise<{ id: number; title: string }[]> {
    const tasks = await this.findAll();
    return tasks.map((task) => ({ id: task.id, title: task.title }));
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
      ],
    });
    const allStandTasks = await this.standTasksRepository.find({
      relations: [
        'components',
        'stands',
        'professionRights',
        'professionRights.professions',
        'professionRights.rights',
      ],
    });
    const standTasksByParent = new Map<string, StandTasks[]>();
    for (const st of allStandTasks) {
      const key = String(st.parentId);
      if (!standTasksByParent.has(key)) standTasksByParent.set(key, []);
      standTasksByParent.get(key)!.push(st);
    }
    // Новый порядок: дата (дедлайн) -> стенд -> сотрудник+задача (id) -> подзадачи (id)
    const deadlineMap = new Map<
      string,
      Map<string, Map<number, CurrentTasks>>
    >();
    for (const task of tasks) {
      const deadline = task.deadline
        ? typeof task.deadline === 'string'
          ? task.deadline
          : (task.deadline as Date).toISOString().split('T')[0]
        : 'Без даты';
      const stand = task.stands?.title || 'Без стенда';
      if (!deadlineMap.has(deadline)) deadlineMap.set(deadline, new Map());
      const standMap = deadlineMap.get(deadline)!;
      if (!standMap.has(stand)) standMap.set(stand, new Map());
      // Ключ — id задачи
      standMap.get(stand)!.set(task.id, task);
    }
    const children = Array.from(deadlineMap.entries()).map(
      ([deadline, standMap]) => ({
        name: deadline,
        deadline: deadline,
        children: Array.from(standMap.entries()).map(([stand, taskMap]) => {
          const firstTask = Array.from(taskMap.values())[0];
          return {
            id: firstTask?.stands?.id,
            name: `Стенд: ${stand}`,
            nodeType: 'stands',
            stand: stand,
            children: Array.from(taskMap.entries()).map(([taskId, task]) => ({
              id: task.id,
              name: [
                `${task.employees?.peoples?.lastName || ''} ${task.employees?.peoples?.firstName || ''} ${task.employees?.peoples?.middleName || ''}`.trim() ||
                  'Без сотрудника',
                `Задача: ${task.title}`,
                `Состояние задачи: ${task.currentTaskStates?.title || ''}`,
              ]
                .filter(Boolean)
                .join(' | '),
              nodeType: 'current_tasks',
              employees:
                `${task.employees?.peoples?.lastName || ''} ${task.employees?.peoples?.firstName || ''} ${task.employees?.peoples?.middleName || ''}`.trim(),
              taskTitle: task.title || '',
              currentTaskState: task.currentTaskStates?.title || '',
              children: (
                standTasksByParent.get(String(task.standTasks?.id)) || []
              ).map((st) => ({
                id: st.id,
                name: [
                  `Задача стенда: ${st.title}`,
                  `Стенд: ${st.stands?.title || ''}`,
                  `Компонент: ${st.components?.title || ''}`,
                  `Кол-во: ${st.componentOutCount}`,
                  `Время изготовления: ${st.manufactureTime ? (typeof st.manufactureTime === 'string' ? st.manufactureTime : (st.manufactureTime as Date).toISOString().split('T')[0]) : ''}`,
                ]
                  .filter(Boolean)
                  .join(' | '),
                nodeType: 'stand_tasks',
                isCompleted: st.isCompleted,
                standTask: st.title || '',
                component: st.components?.title || '',
                manufactureTime: st.manufactureTime
                  ? typeof st.manufactureTime === 'string'
                    ? st.manufactureTime
                    : (st.manufactureTime as Date).toISOString().split('T')[0]
                  : '',
                children: [],
              })),
            })),
          };
        }),
      }),
    );
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
      ],
    });
    // Получаем все stand_tasks одним запросом
    const allStandTasks = await this.standTasksRepository.find({
      relations: [
        'components',
        'stands',
        'professionRights',
        'professionRights.professions',
        'professionRights.rights',
      ],
    });
    // Группируем stand_tasks по parentId
    const standTasksByParent = new Map<string, StandTasks[]>();
    for (const st of allStandTasks) {
      const key = String(st.parentId);
      if (!standTasksByParent.has(key)) standTasksByParent.set(key, []);
      standTasksByParent.get(key)!.push(st);
    }
    // Новый порядок: состояние -> дата -> стенд -> задача (id) -> подзадачи (id)
    const stateMap = new Map<
      string,
      Map<string, Map<string, Map<number, CurrentTasks>>>
    >();
    for (const task of tasks) {
      const state = task.currentTaskStates?.title || 'Без состояния';
      const deadline = task.deadline
        ? typeof task.deadline === 'string'
          ? task.deadline
          : (task.deadline as Date).toISOString().split('T')[0]
        : 'Без даты';
      const stand = task.stands?.title || 'Без стенда';
      if (!stateMap.has(state)) stateMap.set(state, new Map());
      const deadlineMap = stateMap.get(state)!;
      if (!deadlineMap.has(deadline)) deadlineMap.set(deadline, new Map());
      const standMap = deadlineMap.get(deadline)!;
      if (!standMap.has(stand)) standMap.set(stand, new Map());
      standMap.get(stand)!.set(task.id, task);
    }
    const children = Array.from(stateMap.entries()).map(
      ([state, deadlineMap]) => ({
        name: state,
        children: Array.from(deadlineMap.entries()).map(
          ([deadline, standMap]) => ({
            name: deadline,
            deadline: deadline,
            children: Array.from(standMap.entries()).map(
              ([stand, taskMap]) => ({
                name: `Стенд: ${stand}`,
                stand: stand,
                children: Array.from(taskMap.entries()).map(
                  ([taskId, task]) => ({
                    id: task.id,
                    name: `Задача: ${task.title}`,
                    nodeType: 'current_tasks',
                    taskTitle: task.title || '',
                    currentTaskStateId: task.currentTaskStates?.id,
                    currentTaskState: task.currentTaskStates?.title || '',
                    children: (
                      standTasksByParent.get(String(task.standTasks?.id)) || []
                    )
                      .filter(
                        (st) => state !== 'Выполняется' || !st.isCompleted,
                      )
                      .map((st) => ({
                        id: st.id,
                        name: [
                          `Задача стенда: ${st.title}`,
                          `Стенд: ${st.stands?.title || ''}`,
                          `Компонент: ${st.components?.title || ''}`,
                          `Кол-во: ${st.componentOutCount}`,
                          `Время изготовления: ${st.manufactureTime ? (typeof st.manufactureTime === 'string' ? st.manufactureTime : (st.manufactureTime as Date).toISOString().split('T')[0]) : ''}`,
                        ]
                          .filter(Boolean)
                          .join(' | '),
                        nodeType: 'stand_tasks',
                        isCompleted: st.isCompleted,
                        standTask: st.title || '',
                        component: st.components?.title || '',
                        manufactureTime: st.manufactureTime
                          ? typeof st.manufactureTime === 'string'
                            ? st.manufactureTime
                            : (st.manufactureTime as Date)
                                .toISOString()
                                .split('T')[0]
                          : '',
                        _parent: {
                          id: task.id,
                          currentTaskStateId: task.currentTaskStates?.id,
                        },
                        children: [],
                      })),
                  }),
                ),
              }),
            ),
          }),
        ),
      }),
    );
    return { name: 'Мои задачи', children };
  }

  // Получить только основные задачи стенда (parentId == null)
  async getRootStandTasks() {
    return await this.standTasksRepository.find({
      where: { parentId: IsNull() },
    });
  }
}
