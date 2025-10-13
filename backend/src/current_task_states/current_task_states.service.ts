import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentTaskStates } from './current_task_states.entity';

@Injectable()
export class CurrentTaskStatesService {
  constructor(
    @InjectRepository(CurrentTaskStates)
    private repo: Repository<CurrentTaskStates>,
  ) {}

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
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    try {
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
      throw e;
    }
  }

  async getTasksTreeByStatus() {
    try {
      // Получаем все статусы задач
      const states = await this.repo.find({
        order: { id: 'ASC' },
      });

      if (!states || states.length === 0) {
        return { name: 'Состояния текущих задач', children: [] };
      }

      const treeData: any[] = [];

      for (const state of states) {
        // Получаем задачи для каждого статуса с relations
        const stateWithTasks = await this.repo.findOne({
          where: { id: state.id },
          relations: [
            'currentTasks',
            'currentTasks.employees',
            'currentTasks.employees.peoples',
            'currentTasks.stands',
          ],
        });

        const stateNode: any = {
          id: state.id,
          name: state.title,
          nodeType: 'current_task_states',
          children: [],
        };

        // Добавляем задачи как дочерние элементы
        if (
          stateWithTasks &&
          stateWithTasks.currentTasks &&
          stateWithTasks.currentTasks.length > 0
        ) {
          for (const task of stateWithTasks.currentTasks) {
            const employeeName = task.shipmentStands.stands.employees?.peoples
              ? `${task.shipmentStands.stands.employees.peoples.lastName || ''} ${task.shipmentStands.stands.employees.peoples.firstName || ''} ${task.shipmentStands.stands.employees.peoples.middleName || ''}`.trim()
              : 'Не назначен';

            const taskNode: any = {
              id: task.id,
              name: [
                `Срок выполнения: ${task.shipmentStands.shipments.arrivalDate ? (typeof task.shipmentStands.shipments.arrivalDate === 'string' ? task.shipmentStands.shipments.arrivalDate : (task.shipmentStands.shipments.arrivalDate as Date).toISOString().split('T')[0]) : ''}`,
                `Стенд: ${task.shipmentStands.stands?.title || ''}`,
                `Сотрудник: ${employeeName}`,
              ]
                .filter(Boolean)
                .join(' | '),
              nodeType: 'current_tasks',
              deadline: task.shipmentStands.shipments.arrivalDate,
              employee: employeeName,
              stand: task.shipmentStands.stands?.title || 'Не указан',
              status: state.title,
            };

            stateNode.children.push(taskNode);
          }
        }

        treeData.push(stateNode);
      }

      return { name: 'Состояния текущих задач', children: treeData };
    } catch (error: any) {
      return { name: 'Состояния текущих задач', children: [] };
    }
  }
}
