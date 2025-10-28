import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentTaskStates } from './current_task_states.entity';

@Injectable()
export class CurrentTaskStatesService implements OnModuleInit {
  constructor(
    @InjectRepository(CurrentTaskStates)
    private repo: Repository<CurrentTaskStates>,
  ) {}

  async onModuleInit() {
    await this.ensureSystemStates();
  }

  private readonly SYSTEM_STATES = ['Новая', 'Выполняется', 'Завершена', 'Отменена'];

  private async ensureSystemStates() {
    const existing = await this.repo.find({
      where: this.SYSTEM_STATES.map((title) => ({ title })),
      select: ['id', 'title'],
    });

    const existingSet = new Set(existing.map((e) => e.title));

    const toCreate = this.SYSTEM_STATES
      .filter((title) => !existingSet.has(title))
      .map((title) => this.repo.create({ title }));

    if (toCreate.length > 0) {
      await this.repo.save(toCreate);
    }
  }

  async create(data: Partial<CurrentTaskStates>) {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async getAll() {
    return await this.repo.find();
  }

  async getByTitle(title: string) {
    try {
      const currentTaskState = await this.repo.findOne({
        where: {
          title: title,
        },
      });

      if (!currentTaskState)
        throw new NotFoundException(`Не найден статус ${title}`);

      return currentTaskState;
    } catch (e) {
      throw new Error(e);
    }
  }

  async generateData() {
    try {
      const states = await this.getAll();
      const data: any[] = [];

      if (!states) throw new NotFoundException('Ошибка поиска состояний задач');

      states.map((item) => {
        data.push({
          ...item,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getOne(id: number) {
    return await this.repo.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<CurrentTaskStates>) {
    try {
      const existing = await this.repo.findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Статус задачи не найден');

      if (this.SYSTEM_STATES.includes(existing.title)) {
        throw new ForbiddenException('Системный статус нельзя изменять');
      }

      return await this.repo.update(id, data);
    } catch (e) {
      console.error('Ошибка при изменении статуса задачи!', e);
      throw e;
    }
  }

  async delete(id: number) {
    try {
      const existing = await this.repo.findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Статус задачи не найден');

      if (this.SYSTEM_STATES.includes(existing.title)) {
        throw new ForbiddenException('Системный статус нельзя удалять');
      }

      await this.repo.delete(id);
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
      console.error('Ошибка при удалении статуса задачи!', e);
      throw e;
    }
  }

  async getTasksTreeByStatus() {
    try {
      // Получаем все статусы задач с соответствующими связями
      const states = await this.repo.find({
        order: { id: 'ASC' },
        relations: [
          'currentTasks',
          'currentTasks.standTasks',
          'currentTasks.standTasks.stands',
          'currentTasks.shipmentStands',
          'currentTasks.shipmentStands.shipments',
          'currentTasks.shipmentStands.stands.employees',
          'currentTasks.shipmentStands.stands.employees.peoples',
        ],
      });

      if (!states || states.length === 0) {
        return { name: 'Состояния текущих задач', children: [] };
      }

      const treeData: any[] = [];

      for (const state of states) {
        const stateNode: any = {
          id: state.id,
          name: state.title,
          nodeType: 'current_task_states',
          children: [],
        };

        // Добавляем задачи как дочерние элементы
        if (state.currentTasks && state.currentTasks.length > 0) {
          for (const task of state.currentTasks) {
            const employee = task.shipmentStands?.stands?.employees;
            const employeeName = employee?.peoples
              ? `${employee.peoples.lastName || ''} ${employee.peoples.firstName || ''} ${employee.peoples.middleName || ''}`.trim()
              : 'Не назначен';

            const shipment = task.shipmentStands?.shipments;
            const stand = task.shipmentStands?.stands;
            const arrivalDate = shipment?.arrivalDate;

            const taskNode: any = {
              id: task.id,
              name: [
                arrivalDate ? `Срок выполнения: ${typeof arrivalDate === 'string' ? arrivalDate : new Date(arrivalDate).toISOString().split('T')[0]}` : '',
                stand?.title ? `Стенд: ${stand.title}` : '',
                `Сотрудник: ${employeeName}`,
              ]
                .filter(Boolean)
                .join(' | '),
              nodeType: 'current_tasks',
              deadline: arrivalDate,
              employee: employeeName,
              stand: stand?.title || 'Не указан',
              status: state.title,
            };

            stateNode.children.push(taskNode);
          }
        }

        treeData.push(stateNode);
      }

      return { name: 'Состояния текущих задач', children: treeData };
    } catch (error: any) {
      console.error('Error in getTasksTreeByStatus:', error);
      return { name: 'Состояния текущих задач', children: [] };
    }
  }
}
