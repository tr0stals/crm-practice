import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerArrivals } from './server_arrivals.entity';
import { ServerArrivalsDTO } from './dto/ServerArrivalsDTO';
import { ComponentsService } from 'src/components/components.service';
import { CurrentTasksService } from 'src/current_tasks/current_tasks.service';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Injectable()
export class ServerArrivalsService {
  constructor(
    @InjectRepository(ServerArrivals)
    private readonly repo: Repository<ServerArrivals>,
    private componentsService: ComponentsService,
    private currentTaskService: CurrentTasksService,
    private organizationService: OrganizationsService,
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
      const serverArrivals = await this.getAll();
      const data: any[] = [];

      if (!serverArrivals)
        throw new NotFoundException('Ошибка поиска приходов сервера');

      serverArrivals.map((item) => {
        const { components, factory, currentTasks, ...defaultData } = item;

        const componentTitle = components?.title;
        const factoryName = factory?.shortName;
        const currentTasksTitle = currentTasks?.title;

        data.push({
          ...defaultData,
          componentTitle,
          factoryName,
          currentTasksTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: ServerArrivalsDTO) {
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

  async update(id: number, data: Partial<ServerArrivals>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
