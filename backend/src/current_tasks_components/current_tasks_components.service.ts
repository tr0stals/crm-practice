import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CurrentTasksComponents } from './current_tasks_components.entity';
import { CurrentTasksComponentsDTO } from './dto/CurrentTasksComponentsDTO';
import { ComponentsService } from 'src/components/components.service';
import { CurrentTasksService } from 'src/current_tasks/current_tasks.service';
import { ComponentQuantityWatcherService } from 'src/features/component-quantity-watcher/component-quantity-watcher.service';

@Injectable()
export class CurrentTasksComponentsService {
  constructor(
    @InjectRepository(CurrentTasksComponents)
    private readonly repo: Repository<CurrentTasksComponents>,
    private componentService: ComponentsService,
    private currentTaskService: CurrentTasksService,
    private readonly componentQuantityWatcher: ComponentQuantityWatcherService,
  ) {}

  async findAll() {
    return await this.repo.find({ relations: ['currentTask', 'component'] });
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['currentTask', 'component'],
    });
  }

  async generateData() {
    try {
      const currentTaskComponents = await this.findAll();
      const data: any[] = [];

      if (!currentTaskComponents)
        throw new NotFoundException('Ошибка поиска запчастей текущих задач');

      currentTaskComponents.map((item) => {
        const { component, currentTask, ...defaultData } = item;
        const componentTitle = component?.title;
        const currentTaskTitle = currentTask?.standTasks.title;

        data.push({
          ...defaultData,
          currentTaskTitle,
          componentTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: CurrentTasksComponentsDTO) {
    try {
      const { componentId, currentTaskId, ...defaultData } = data;

      const component = await this.componentService.findOne(componentId);
      const currentTask = await this.currentTaskService.findOne(currentTaskId);

      if (!component) throw new Error('Не найдена компонента');
      if (!currentTask) throw new Error('Не найдена currentTask');

      const entity = this.repo.create({
        ...defaultData,
        component: component,
        currentTask: currentTask,
      } as DeepPartial<CurrentTasksComponents>);

      const result = await this.repo.save(entity);

      // Проверяем, нужно ли пересчитать компонент (если задача уже завершена)
      await this.componentQuantityWatcher.onCurrentTaskComponentChange(componentId, currentTaskId);

      return result;
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<CurrentTasksComponents>) {
    // Получаем текущую запись для доступа к componentId и currentTaskId
    const existingRecord = await this.repo.findOne({
      where: { id },
      relations: ['component', 'currentTask']
    });

    await this.repo.update(id, data);
    const result = await this.repo.findOne({ where: { id } });

    // Пересчитываем компонент, если задача завершена
    if (existingRecord?.component?.id && existingRecord?.currentTask?.id) {
      await this.componentQuantityWatcher.onCurrentTaskComponentChange(
        existingRecord.component.id,
        existingRecord.currentTask.id
      );
    }

    return result;
  }

  async remove(id: number) {
    try {
      // Получаем запись перед удалением для пересчета
      const existingRecord = await this.repo.findOne({
        where: { id },
        relations: ['component', 'currentTask']
      });

      await this.repo.delete(id);

      // Пересчитываем компонент после удаления, если задача была завершена
      if (existingRecord?.component?.id && existingRecord?.currentTask?.id) {
        await this.componentQuantityWatcher.onCurrentTaskComponentChange(
          existingRecord.component.id,
          existingRecord.currentTask.id
        );
      }
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
}
