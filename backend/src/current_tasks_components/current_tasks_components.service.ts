import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CurrentTasksComponents } from './current_tasks_components.entity';
import { CurrentTasksComponentsDTO } from './dto/CurrentTasksComponentsDTO';
import { ComponentsService } from 'src/components/components.service';
import { CurrentTasksService } from 'src/current_tasks/current_tasks.service';

@Injectable()
export class CurrentTasksComponentsService {
  constructor(
    @InjectRepository(CurrentTasksComponents)
    private readonly repo: Repository<CurrentTasksComponents>,
    private componentService: ComponentsService,
    private currentTaskService: CurrentTasksService,
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
        const currentTaskTitle = currentTask?.title;

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

      return await this.repo.save(entity);
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<CurrentTasksComponents>) {
    await this.repo.update(id, data);
    return await this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
