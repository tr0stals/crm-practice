import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerWriteoff } from './server_writeoff.entity';
import { ServerWriteoffDTO } from './dto/ServerWriteoffDTO';
import { ComponentsService } from 'src/components/components.service';
import { CurrentTasksService } from 'src/current_tasks/current_tasks.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { ComponentQuantityWatcherService } from 'src/features/component-quantity-watcher/component-quantity-watcher.service';

@Injectable()
export class ServerWriteoffService {
  constructor(
    @InjectRepository(ServerWriteoff)
    private readonly repo: Repository<ServerWriteoff>,
    private componentsService: ComponentsService,
    private currentTaskService: CurrentTasksService,
    private organizationService: OrganizationsService,
    private readonly componentQuantityWatcher: ComponentQuantityWatcherService,
  ) {}

  async getAll() {
    return this.repo.find({
      relations: ['factory', 'components', 'currentTasks'],
    });
  }

  async getOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['factory', 'components', 'currentTasks'],
    });
  }

  async generateData() {
    try {
      const serverWriteoffs = await this.getAll();
      const data: any[] = [];

      if (!serverWriteoffs)
        throw new NotFoundException('Ошибка при поиске серверных списаний');

      serverWriteoffs.map((item) => {
        const { components, factory, currentTasks, ...defaultData } = item;
        const componentTitle = components?.title;
        const factoryName = factory?.shortName;
        const currentTaskTitle = currentTasks?.standTasks.title;

        data.push({
          ...defaultData,
          componentTitle,
          factoryName,
          currentTaskTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: ServerWriteoffDTO) {
    try {
      const { componentId, currentTaskId, factoryId, ...defaultData } = data;

      const component = await this.componentsService.findOne(componentId);
      const currentTask = await this.currentTaskService.findOne(currentTaskId);
      const factory = await this.organizationService.getById(factoryId);

      if (!component || !currentTask || !factory)
        throw new NotFoundException('Одна из сущностей не найдена');

      const entity = this.repo.create({
        ...defaultData,
        components: component,
        currentTasks: currentTask,
        factory: factory,
      });

      return await this.repo.save(entity);
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<ServerWriteoff>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    try {
      // Получаем componentId до удаления для последующего пересчета
      const existingRecord = await this.repo.findOne({
        where: { id },
        relations: ['components', 'factory']
      });

      await this.repo.delete(id);

      // Автоматически пересчитываем количество компонента после удаления
      if (existingRecord?.components?.id) {
        await this.componentQuantityWatcher.onWriteoffChange(existingRecord.components.id);
        console.log(`[SERVER_WRITEOFF] Пересчитаны компоненты после удаления списания #${id} для компонента #${existingRecord.components.id}`);
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
