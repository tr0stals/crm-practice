import { Injectable, NotFoundException } from '@nestjs/common';
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
    return await this.repo.delete(id);
  }

  async getTasksTreeByStatus() {
    try {
      // Получаем все статусы задач
      const states = await this.repo.find({
        order: { id: 'ASC' }
      });

      if (!states || states.length === 0) {
        throw new NotFoundException('Статусы задач не найдены');
      }

      const treeData: any[] = [];

      for (const state of states) {
        // Получаем задачи для каждого статуса с relations
        const stateWithTasks = await this.repo.findOne({
          where: { id: state.id },
          relations: ['currentTasks', 'currentTasks.employees', 'currentTasks.employees.peoples', 'currentTasks.stands']
        });

        const stateNode: any = {
          id: state.id,
          name: state.title,
          nodeType: 'current_task_states',
          children: []
        };

        // Добавляем задачи как дочерние элементы
        if (stateWithTasks && stateWithTasks.currentTasks && stateWithTasks.currentTasks.length > 0) {
          for (const task of stateWithTasks.currentTasks) {
            const employeeName = task.employees?.peoples 
              ? `${task.employees.peoples.lastName || ''} ${task.employees.peoples.firstName || ''} ${task.employees.peoples.middleName || ''}`.trim()
              : 'Не назначен';

            const taskNode: any = {
              id: task.id,
              name: [
                `Срок выполнения: ${task.deadline ? (typeof task.deadline === 'string' ? task.deadline : (task.deadline as Date).toISOString().split('T')[0]) : ''}`,
                `Задача стенда: ${task.title}`,
                `Стенд: ${task.stands?.title || ''}`,
                `Сотрудник: ${employeeName}`,
              ]
                .filter(Boolean)
                .join(' | '),
              nodeType: 'current_tasks',
              deadline: task.deadline,
              employee: employeeName,
              stand: task.stands?.title || 'Не указан',
              status: state.title
            };

            stateNode.children.push(taskNode);
          }
        }

        treeData.push(stateNode);
      }

      return { name: 'Состояния текущих задач', children: treeData };
    } catch (error) {
      throw new Error(`Ошибка при получении дерева задач: ${error.message}`);
    }
  }
}
