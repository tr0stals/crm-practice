import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, IsNull, Not } from 'typeorm';
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
import { ComponentQuantityWatcherService } from 'src/features/component-quantity-watcher/component-quantity-watcher.service';
import { ServerWriteoffBusinessService } from 'src/features/server-writeoff-business/server-writeoff-business.service';

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
    private readonly componentQuantityWatcher: ComponentQuantityWatcherService,
    private readonly serverWriteoffBusiness: ServerWriteoffBusinessService,
  ) {}

  async create(data: CurrentTasksDTO): Promise<CurrentTasks> {
    const shipmentStand = await this.shipmentStandsRepository.findOne({
      where: {
        id: data.shipmentStandId,
      },
      relations: [
        'shipments',
        'stands',
        'stands.employees',
        'stands.employees.users',
      ],
    });

    const currentTaskState = await this.currentTaskStatesRepository.findOne({
      where: { id: data.currentTaskStateId },
    });

    const standTask = await this.standTasksRepository.findOne({
      where: { id: data.standTaskId },
      relations: ['stands', 'professions', 'components'],
    });

    if (!shipmentStand || !currentTaskState || !standTask) {
      throw new Error('Related entities not found');
    }

    console.log(shipmentStand);

    // Отправляем уведомление до создания entity
    if (
      shipmentStand?.stands?.employees?.users &&
      shipmentStand?.stands?.employees?.users?.length > 0
    ) {
      const user = shipmentStand?.stands?.employees?.users?.[0]; // Берем первого пользователя
      const employeeName =
        `${shipmentStand?.stands?.employees?.peoples?.lastName || ''} ${shipmentStand.stands.employees.peoples?.firstName || ''} ${shipmentStand.stands.employees.peoples?.middleName || ''}`.trim();
      const message = `Вам назначена новая задача: на стенде "${shipmentStand.stands.title}". Дата отправки: ${shipmentStand.shipments.arrivalDate}`;

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
        `[NOTIFICATION] У сотрудника ${shipmentStand.stands.employees.id} нет пользователей для уведомлений`,
      );
      console.log(
        `[DEBUG] employee.users:`,
        shipmentStand.stands.employees.users,
      );

      // Попробуем найти пользователя напрямую
      const directUser = await this.userRepository.findOne({
        where: { employees: { id: shipmentStand.stands.employees.id } },
      });

      if (directUser) {
        const employeeName =
          `${shipmentStand.stands.employees.peoples?.lastName || ''} ${shipmentStand.stands.employees.peoples?.firstName || ''} ${shipmentStand.stands.employees.peoples?.middleName || ''}`.trim();
        const message = `Вам назначена новая задача: на стенде "${shipmentStand.stands.title}". Дедлайн: ${shipmentStand.shipments.arrivalDate}`;
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
          `[DEBUG] Пользователь не найден даже напрямую для сотрудника ${shipmentStand.stands.employees.id}`,
        );
      }
    }

    const entity: DeepPartial<CurrentTasks> =
      this.currentTasksRepository.create({
        currentTaskStates: currentTaskState,
        standTasks: standTask,
        shipmentStands: shipmentStand,
      });

    const savedTask = await this.currentTasksRepository.save(entity);

    // Логируем первоначальный статус задачи
    await this.currentTaskStatesLogService.logStateChange(
      savedTask.id,
      currentTaskState.id,
    );

    return savedTask;
  }

  async findAll(): Promise<CurrentTasks[]> {
    return await this.currentTasksRepository.find({
      relations: [
        'currentTaskStates',
        'standTasks',
        'shipmentStands',
        'shipmentStands.stands',
        'shipmentStands.stands.employees',
        'shipmentStands.stands.employees.peoples',
      ],
    });
  }

  async generateData() {
    const currentTasks = await this.findAll();
    const data: any[] = [];

    if (!currentTasks)
      throw new NotFoundException('Ошибка поиска текущих задач');

    currentTasks.map((item) => {
      const { standTasks, shipmentStands, currentTaskStates, ...defaultData } =
        item;

      const { stands } = shipmentStands;
      console.log('stands!!!!!!!!!!', shipmentStands);

      const standTaskTitle = standTasks?.title;
      const employeesName = `${stands.employees.peoples?.firstName} ${stands.employees.peoples?.middleName} ${stands.employees.peoples?.lastName}`;
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

    console.log('CURRENTDATA!!!!!', data);

    return data;
  }

  async findOne(id: number): Promise<CurrentTasks> {
    const entity = await this.currentTasksRepository.findOne({
      where: { id },
      relations: [
        'currentTaskStates',
        'standTasks',
        'standTasks.components',
        'shipmentStands',
        'shipmentStands.shipments',
        'shipmentStands.shipments.factory',
        'shipmentStands.stands',
      ],
    });
    if (!entity) {
      throw new NotFoundException(`Текущая задача с ID ${id} не найдена`);
    }
    return entity;
  }

  async update(
    id: number,
    data: Partial<CurrentTasks>,
    userId?: string,
  ): Promise<CurrentTasks> {
    const existingTask = await this.findOne(id); // Проверяем существование и получаем текущее состояние

    // Проверяем, изменился ли статус на завершенный (ID = 3) или isCompleted = true
    let shouldRecalculateComponents = false;

    // Проверяем изменение статуса
    if (
      data.currentTaskStates &&
      data.currentTaskStates.id !== existingTask.currentTaskStates?.id
    ) {
      // Получаем новый статус
      const newStatus = await this.currentTaskStatesRepository.findOne({
        where: { id: data.currentTaskStates.id },
      });

      // Проверяем, что новый статус - завершенный (ID = 3)
      if (newStatus?.id === 3) {
        shouldRecalculateComponents = true;
      }

      // Логируем изменение статуса
      await this.currentTaskStatesLogService.logStateChange(
        id,
        data.currentTaskStates.id,
      );
    }

    // Проверяем изменение флага isCompleted
    if (data.isCompleted !== undefined && data.isCompleted === true) {
      shouldRecalculateComponents = true;
    }

    await this.currentTasksRepository.update(id, data);
    const updatedTask = await this.findOne(id);

    // Если нужно пересчитать компоненты, вызываем пересчет
    if (shouldRecalculateComponents) {
      // Если задача завершена, проверяем доступность компонентов
      if (updatedTask.isCompleted) {
        const areComponentsAvailable =
          await this.componentQuantityWatcher.checkTaskComponentsAvailability(
            id,
            userId,
          );

        if (!areComponentsAvailable) {
          // Откатываем статус задачи
          const inProgressState =
            await this.currentTaskStatesRepository.findOne({
              where: [{ title: 'Выполняется' }, { title: 'Выполняется' }],
            });

          if (inProgressState) {
            await this.currentTasksRepository.update(id, {
              isCompleted: false,
              currentTaskStates: inProgressState,
            });
          }

          // Отправляем уведомление через WebSocket
          if (userId) {
            this.wsGateway.sendNotification(
              userId,
              'Недостаточно компонентов для выполнения задачи. Задача возвращена в статус "Выполняется".',
              'error',
            );
          }

          throw new HttpException(
            {
              message:
                'Недостаточно компонентов для выполнения задачи. Задача возвращена в статус "Выполняется".',
              type: 'component_insufficient',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        // Создаем запись в server_writeoff после успешной проверки
        try {
          const writeoff =
            await this.serverWriteoffBusiness.createWriteoffFromCurrentTask(
              updatedTask,
            );
          console.log(
            `[SERVER_WRITEOFF] Создано списание #${writeoff.id} для задачи #${id} (через update)`,
          );
        } catch (error) {
          console.error(
            `[SERVER_WRITEOFF] Ошибка при создании списания для задачи #${id}:`,
            error.message,
          );
          // Не прерываем процесс, но логируем ошибку
        }
      }

      await this.componentQuantityWatcher.onCurrentTaskStatusChange(id);
    }

    return updatedTask;
  }

  async remove(id: number): Promise<void> {
    try {
      await this.findOne(id); // Проверяем существование
      await this.currentTasksRepository.delete(id);
    } catch (e: any) {
      if (e.code === 'ER_ROW_IS_REFERENCED_2') {
        const match = e.sqlMessage.match(/`([^`]+)`\.`([^`]+)`/);
        let tableName = match ? match[2] : '';

        throw new HttpException(
          {
            message: `Невозможно удалить запись. Есть связанные записи в таблице "${tableName}". Удалите их сначала.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw e;
    }
  }

  async startTask(currentTaskId: number, employeeId: number) {
    let executor: Employees | null = null;
    const currentTask = await this.currentTasksRepository.findOne({
      where: { id: currentTaskId },
      relations: ['currentTaskStates', 'standTasks', 'shipmentStands'],
    });
    if (!currentTask) throw new Error('Задача не найдена');

    if (employeeId) {
      const targetEmployee = await this.employeeRepository.findOne({
        where: { id: employeeId },
        relations: ['peoples'],
      });

      if (!targetEmployee) {
        console.debug('!!!!!!!!');
        throw new Error('Сотрудник не найден');
      }

      console.log('targetEmployee', targetEmployee);
      executor = targetEmployee;
    }

    // Отправляем уведомление о начале задачи
    if (
      currentTask.shipmentStands?.stands?.employees?.users &&
      currentTask.shipmentStands?.stands?.employees?.users.length > 0
    ) {
      const user = currentTask.shipmentStands?.stands?.employees?.users[0];
      const message = `Задача "${currentTask.standTasks?.title}" на стенде "${currentTask.shipmentStands?.stands?.title}" начата`;

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
      await this.currentTaskStatesLogService.logStateChange(
        currentTaskId,
        inProgressState.id,
      );
      currentTask.currentTaskStates = inProgressState;
      if (executor) currentTask.employees = executor;
    }
    return await this.currentTasksRepository.save(currentTask);
  }

  async completeTask(taskId: number, userId?: string) {
    const task = await this.currentTasksRepository.findOne({
      where: { id: taskId },
      relations: [
        'currentTaskStates',
        'standTasks',
        'standTasks.components',
        'shipmentStands',
        'shipmentStands.stands',
        'shipmentStands.stands.employees',
        'shipmentStands.stands.employees.users',
        'shipmentStands.stands.employees.peoples',
        'shipmentStands.shipments',
        'shipmentStands.shipments.factory',
      ],
    });

    if (!task) throw new NotFoundException('Задача не найдена');

    // Если уже завершена — ничего не делаем
    if (task.isCompleted) {
      return { success: true, message: 'Задача уже завершена' };
    }

    // 1️⃣ Помечаем задачу как завершённую
    task.isCompleted = true;

    // 2️⃣ Меняем статус на "Завершена"
    const completedState = await this.currentTaskStatesRepository.findOne({
      where: [{ title: 'Завершена' }, { title: 'COMPLETED' }],
    });

    if (!completedState)
      throw new Error('Не найден статус "Завершена" в current_task_states');

    task.currentTaskStates = completedState;

    // 3️⃣ Сохраняем изменения
    await this.currentTasksRepository.save(task);

    // 4️⃣ Логируем изменение статуса
    await this.currentTaskStatesLogService.logStateChange(
      taskId,
      completedState.id,
    );

    // 5️⃣ Отправляем уведомление сотруднику
    const employeeUser = task.shipmentStands.stands.employees?.users?.[0];
    if (employeeUser) {
      const message = `Задача "${task.standTasks.title}" на стенде "${task.shipmentStands.stands.title}" завершена`;
      this.wsGateway.sendNotification(
        employeeUser.id.toString(),
        message,
        'task_completed',
      );
    }

    // 6️⃣ Создаем запись в server_writeoff
    try {
      const writeoff =
        await this.serverWriteoffBusiness.createWriteoffFromCurrentTask(task);
      console.log(
        `[SERVER_WRITEOFF] Создано списание #${writeoff.id} для задачи #${taskId}`,
      );
    } catch (error) {
      console.error(
        `[SERVER_WRITEOFF] Ошибка при создании списания для задачи #${taskId}:`,
        error.message,
      );
      // Не прерываем процесс, но логируем ошибку
    }

    // 7️⃣ Проверяем доступность компонентов перед завершением задачи
    const areComponentsAvailable =
      await this.componentQuantityWatcher.checkTaskComponentsAvailability(
        taskId,
        userId,
      );

    if (!areComponentsAvailable) {
      // Если компонентов недостаточно, откатываем статус задачи
      const inProgressState = await this.currentTaskStatesRepository.findOne({
        where: [{ title: 'Выполняется' }, { title: 'Выполняется' }],
      });

      if (inProgressState) {
        await this.currentTasksRepository.update(taskId, {
          isCompleted: false,
          currentTaskStates: inProgressState,
        });
      }

      // Отправляем уведомление через WebSocket
      if (userId) {
        this.wsGateway.sendNotification(
          userId,
          'Недостаточно компонентов для выполнения задачи. Задача возвращена в статус "Выполняется".',
          'error',
        );
      }

      throw new HttpException(
        {
          message:
            'Недостаточно компонентов для выполнения задачи. Задача возвращена в статус "Выполняется".',
          type: 'component_insufficient',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // 8️⃣ Пересчитываем компоненты
    await this.componentQuantityWatcher.onCurrentTaskStatusChange(taskId);

    return { success: true, message: 'Задача успешно завершена' };
  }

  async getAllTaskTitles(): Promise<{ id: number; title: string }[]> {
    const tasks = await this.findAll();
    return tasks.map((task) => ({ id: task.id, title: task.standTasks.title }));
  }

  // Метод: дерево текущих задач для всех (директор / админ)
  async getCurrentTasksTreeForAll(): Promise<any> {
    const currentTasks = await this.currentTasksRepository.find({
      relations: [
        'currentTaskStates',
        'standTasks',
        'standTasks.professions',
        'standTasks.components',
        'standTasks.standTasksComponents',
        'standTasks.standTasksComponents.component',
        'employees',
        'employees.peoples',
        'shipmentStands',
        'shipmentStands.shipments',
        'shipmentStands.stands',
        'shipmentStands.stands.employees',
        'shipmentStands.stands.employees.peoples',
      ],
    });

    const allStandTasks = await this.standTasksRepository.find({
      relations: [
        'components',
        'stands',
        'professions',
        'standTasksComponents',
        'standTasksComponents.component',
      ],
    });

    // --- группируем standTasks по parentId
    const standTasksByParent = new Map<number | null, StandTasks[]>();
    for (const st of allStandTasks) {
      const key = st.parentId ?? null;
      if (!standTasksByParent.has(key)) standTasksByParent.set(key, []);
      standTasksByParent.get(key)!.push(st);
    }

    // --- вспомогательная функция: получить список компонентов
    const getComponentsForStandTask = (st: any) => {
      const comps: Array<{ title: string; count?: number }> = [];

      if (st?.components) {
        comps.push({
          title: st.components.title,
          count: st.componentOutCount ?? undefined,
        });
      }

      if (Array.isArray(st?.standTasksComponents)) {
        for (const link of st.standTasksComponents) {
          const component = link?.component || link?.components;
          if (component) {
            comps.push({
              title: component.title || 'Без названия',
              count:
                link.count ??
                link.componentOutCount ??
                link.quantity ??
                undefined,
            });
          }
        }
      }

      // убираем дубли
      const unique = new Map<string, { title: string; count?: number }>();
      for (const c of comps) {
        if (!unique.has(c.title)) unique.set(c.title, c);
      }

      return Array.from(unique.values());
    };

    // --- группируем задачи по дедлайну и стенду
    const deadlineMap = new Map<string, Map<string, CurrentTasks[]>>();

    for (const ct of currentTasks) {
      const deadline = ct.shipmentStands?.shipments?.shipmentDate
        ? ct.shipmentStands.shipments.shipmentDate instanceof Date
          ? ct.shipmentStands.shipments.shipmentDate.toISOString().split('T')[0]
          : ct.shipmentStands.shipments.shipmentDate
        : 'Без даты';

      const stand = ct.shipmentStands?.stands?.title || 'Без стенда';

      if (!deadlineMap.has(deadline)) deadlineMap.set(deadline, new Map());
      const standMap = deadlineMap.get(deadline)!;

      if (!standMap.has(stand)) standMap.set(stand, []);
      standMap.get(stand)!.push(ct);
    }

    // --- строим дерево подзадач (standTasks)
    const buildTasksTree = (tasksInGroup: CurrentTasks[]): any[] => {
      const byStandTaskId = new Map<number, CurrentTasks[]>();
      for (const ct of tasksInGroup) {
        const stId = ct.standTasks?.id;
        if (!stId) continue;
        if (!byStandTaskId.has(stId)) byStandTaskId.set(stId, []);
        byStandTaskId.get(stId)!.push(ct);
      }

      const buildNodes = (parentStandTaskId: number | null): any[] => {
        const nodes: any[] = [];

        for (const [standTaskId, ctArray] of byStandTaskId.entries()) {
          const st = ctArray[0].standTasks;
          const parentId = st?.parentId ?? null;

          if (parentId === parentStandTaskId) {
            for (const ct of ctArray) {
              const employeeName =
                [
                  ct.employees?.peoples?.lastName || '',
                  ct.employees?.peoples?.firstName || '',
                  ct.employees?.peoples?.middleName || '',
                ]
                  .map((s) => s?.trim())
                  .filter(Boolean)
                  .join(' ') || 'Без сотрудника';

              // компоненты
              const components = getComponentsForStandTask(st);
              const componentNodes = components.map((c) => ({
                name: `Компонент: ${c.title}${
                  c.count ? ` (${c.count} шт.)` : ''
                }`,
                nodeType: 'components',
                children: [],
              }));

              // рекурсивно строим подзадачи
              const subTaskNodes = buildNodes(st.id ?? null);

              nodes.push({
                id: ct.id,
                nodeType: 'current_tasks',
                standTaskId: st?.id ?? null,
                name: [
                  `Задача: ${st?.title || 'Без названия'}`,
                  `Исполнитель: ${employeeName}`,
                  `Состояние: ${ct.currentTaskStates?.title || 'Без состояния'}`,
                ].join(' | '),
                employees: employeeName,
                taskTitle: st?.title || '',
                currentTaskState: ct.currentTaskStates?.title || '',
                isCompleted: !!ct.isCompleted,
                children: [...subTaskNodes, ...componentNodes],
              });
            }
          }
        }

        return nodes;
      };

      return buildNodes(null);
    };

    // --- собираем полное дерево: дедлайн → стенд → задачи
    const children = Array.from(deadlineMap.entries()).map(
      ([deadline, standMap]) => ({
        name: `Дедлайн: ${deadline}`,
        nodeType: 'deadline',
        children: Array.from(standMap.entries()).map(
          ([stand, tasksInGroup]) => {
            const standEmployees =
              tasksInGroup[0]?.shipmentStands?.stands?.employees;
            const responsibleNames =
              `${standEmployees?.peoples?.lastName || ''} ${
                standEmployees?.peoples?.firstName || ''
              } ${standEmployees?.peoples?.middleName || ''}`.trim() ||
              'Без сотрудника';

            return {
              name: `Стенд: ${stand}, Ответственный: ${responsibleNames}`,
              nodeType: 'stands',
              children: buildTasksTree(tasksInGroup),
            };
          },
        ),
      }),
    );

    return { name: 'Текущие задачи', children };
  }

  // Новый метод: дерево только для сотрудника
  async buildCurrentTasksTree(employeeProfession: string) {
    const currentTasks = await this.currentTasksRepository.find({
      where: {
        standTasks: {
          professions: { title: employeeProfession },
        },
      },
      relations: [
        'currentTaskStates',
        'standTasks',
        'standTasks.professions',
        'standTasks.components',
        'standTasks.standTasksComponents',
        'standTasks.standTasksComponents.component',
        'employees',
        'employees.peoples',
        'shipmentStands',
        'shipmentStands.shipments',
        'shipmentStands.stands',
        'shipmentStands.stands.employees',
        'shipmentStands.stands.employees.peoples',
      ],
    });

    const filteredTasks = currentTasks.filter(
      (task) =>
        !task.isCompleted &&
        task.currentTaskStates?.title?.toLowerCase() !== 'завершена',
    );

    if (!filteredTasks || filteredTasks.length === 0) {
      return { name: 'Мои задачи', children: [] };
    }

    const formatDate = (d: Date | string | undefined | null) => {
      if (!d) return 'Без даты';
      if (typeof d === 'string') return d;
      return (d as Date).toISOString().split('T')[0];
    };

    const stateMap = new Map<
      string,
      Map<string, Map<string, CurrentTasks[]>>
    >();

    for (const task of filteredTasks) {
      const state = task.currentTaskStates?.title || 'Без состояния';
      const deadline = formatDate(task.shipmentStands?.shipments?.shipmentDate);
      const stand = task.shipmentStands?.stands?.title || 'Без стенда';

      if (!stateMap.has(state)) stateMap.set(state, new Map());
      const deadlineMap = stateMap.get(state)!;

      if (!deadlineMap.has(deadline)) deadlineMap.set(deadline, new Map());
      const standMap = deadlineMap.get(deadline)!;

      if (!standMap.has(stand)) standMap.set(stand, []);
      standMap.get(stand)!.push(task);
    }

    const getComponentsForStandTask = (st: any) => {
      const comps: Array<{ title: string; count?: number }> = [];

      if (st?.components) {
        comps.push({
          title: st.components.title,
          count: st.componentOutCount ?? undefined,
        });
      }

      if (Array.isArray(st?.standTasksComponents)) {
        for (const link of st.standTasksComponents) {
          const component = link?.component || link?.components;
          if (component) {
            comps.push({
              title: component.title || 'Без названия',
              count:
                link.count ??
                link.componentOutCount ??
                link.quantity ??
                undefined,
            });
          }
        }
      }

      const unique = new Map<string, { title: string; count?: number }>();
      for (const c of comps) {
        if (!unique.has(c.title)) unique.set(c.title, c);
      }

      return Array.from(unique.values());
    };

    const buildTasksForestForGroup = (tasksInGroup: CurrentTasks[]) => {
      const byStandTaskId = new Map<number, CurrentTasks[]>();
      for (const ct of tasksInGroup) {
        const stId = ct.standTasks?.id;
        if (!stId) continue;
        if (!byStandTaskId.has(stId)) byStandTaskId.set(stId, []);
        byStandTaskId.get(stId)!.push(ct);
      }

      const buildNodes = (parentStandTaskId: number | null): any[] => {
        const nodes: any[] = [];

        for (const [standTaskId, ctArray] of byStandTaskId.entries()) {
          const st = ctArray[0].standTasks;
          const parentId = (st?.parentId ?? null) as number | null;

          if ((parentId ?? null) === (parentStandTaskId ?? null)) {
            for (const ct of ctArray) {
              const employeeName =
                [
                  ct.employees?.peoples?.lastName || '',
                  ct.employees?.peoples?.firstName || '',
                  ct.employees?.peoples?.middleName || '',
                ]
                  .map((s) => s?.trim())
                  .filter(Boolean)
                  .join(' ') || 'Без сотрудника';

              // получаем список компонентов
              const components = getComponentsForStandTask(st);

              // превращаем компоненты в дочерние узлы
              const componentNodes = components.map((c) => ({
                name: `Компонент: ${c.title}${c.count ? ` (${c.count} шт.)` : ''}`,
                nodeType: 'components',
                children: [],
              }));

              const node = {
                id: ct.id,
                nodeType: 'current_tasks',
                standTaskId: st?.id ?? null,
                name: [
                  `Задача: ${st?.title || 'Без названия'}`,
                  `Исполнитель: ${employeeName}`,
                ].join(' | '),
                employees: employeeName,
                taskTitle: st?.title || '',
                currentTaskState: ct.currentTaskStates?.title || '',
                isCompleted: !!ct.isCompleted,
                // добавляем компоненты как дочерние узлы
                children: [...buildNodes(st?.id ?? null), ...componentNodes],
              };

              nodes.push(node);
            }
          }
        }

        return nodes;
      };

      return buildNodes(null);
    };

    // 7️⃣ Преобразуем всё в дерево: Состояние → Дедлайн → Стенд → Задачи → Компоненты
    const children = Array.from(stateMap.entries()).map(
      ([state, deadlineMap]) => ({
        name: `Состояние: ${state}`,
        nodeType: 'state',
        children: Array.from(deadlineMap.entries()).map(
          ([deadline, standMap]) => ({
            name: `Дедлайн: ${deadline}`,
            nodeType: 'deadline',
            children: Array.from(standMap.entries()).map(
              ([stand, tasksInGroup]) => {
                // достаём всех сотрудников стенда
                const standEmployees =
                  tasksInGroup[0]?.shipmentStands?.stands?.employees ?? [];

                // формируем список ФИО
                const responsibleNames =
                  `${standEmployees.peoples.lastName} ${standEmployees.peoples.firstName} ${standEmployees.peoples.middleName}`.trim();

                return {
                  name: `Стенд: ${stand}, Ответственный: ${responsibleNames}`,
                  nodeType: 'stands',
                  children: buildTasksForestForGroup(tasksInGroup),
                };
              },
            ),
          }),
        ),
      }),
    );

    // 8️⃣ Возвращаем итоговое дерево
    return { name: 'Мои задачи', children };
  }

  async createTree(employeeProfession: string) {
    const standTasks = await this.standTasksRepository.find({
      relations: ['stands', 'professions', 'components'],
    });

    const currentTasks = await this.currentTasksRepository.find({
      relations: [
        'currentTaskStates',
        'standTasks',
        'shipmentStands',
        'shipmentStands.stands',
        'shipmentStands.stands.employees',
        'shipmentStands.stands.employees.peoples',
      ],
      where: {
        standTasks: {
          professions: {
            title: employeeProfession,
          },
        },
      },
    });

    if (!currentTasks) return null;

    const tree = currentTasks.map((currentTask) => ({
      name: `Состояние: ${currentTask.currentTaskStates?.title}`,
      children: {},
    }));
  }

  // Получить только основные задачи стенда (parentId == null)
  async getRootStandTasks() {
    return await this.standTasksRepository.find({
      where: { parentId: IsNull() },
    });
  }
}
