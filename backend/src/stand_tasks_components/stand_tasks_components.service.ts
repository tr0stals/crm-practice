import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { StandTasksComponents } from './stand_tasks_components.entity';
import { StandTasksComponentsDTO } from './dto/StandTasksComponentsDTO';
import { ComponentsService } from 'src/components/components.service';
import { StandTasksService } from 'src/stand_tasks/stand_tasks.service';
import { Components } from 'src/components/components.entity';

@Injectable()
export class StandTasksComponentsService {
  constructor(
    @InjectRepository(StandTasksComponents)
    private readonly repo: Repository<StandTasksComponents>,
    private componentService: ComponentsService,
    private standTaskService: StandTasksService,
  ) {}

  async findAll() {
    return await this.repo.find({ relations: ['standTask', 'component'] });
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['standTask', 'component'],
    });
  }

  async getByStandTask(id: number) {
    try {
      return await this.repo.find({
        where: {
          standTask: { id: id },
        },
        relations: ['standTask', 'component'],
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async generateData() {
    try {
      const standTasksComponents = await this.findAll();
      const data: any[] = [];

      if (!standTasksComponents)
        throw new NotFoundException(
          'Ошибка при поиске компонентов задач стендов',
        );

      standTasksComponents.map((item) => {
        const { component, standTask, ...defaultData } = item;
        const componentTitle = component?.title;
        const standTaskTitle = standTask?.title;

        data.push({
          ...defaultData,
          standTaskTitle,
          componentTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: StandTasksComponentsDTO) {
    try {
      const { componentId, standTaskId, ...defaultData } = data;

      let component: Components | null = null;

      if (componentId)
        component = await this.componentService.findOne(componentId);
      const standTask = await this.standTaskService.getOne(standTaskId);

      if (!standTask)
        throw new NotFoundException('Одна из сущностей не найдена');

      const entity = this.repo.create({
        ...defaultData,
        component: component,
        standTask: standTask,
      } as DeepPartial<StandTasksComponents>);

      return await this.repo.save(entity);
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<StandTasksComponents>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
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
}
