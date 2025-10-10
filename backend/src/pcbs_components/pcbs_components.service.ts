import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { PcbsComponents } from './pcbs_components.entity';
import { PcbsComponentsDTO } from './dto/PcbsComponentsDTO';
import { ComponentsService } from 'src/components/components.service';
import { PcbsService } from 'src/pcbs/pcbs.service';

@Injectable()
export class PcbsComponentsService {
  constructor(
    @InjectRepository(PcbsComponents)
    private readonly repo: Repository<PcbsComponents>,
    private componentsService: ComponentsService,
    private pcbService: PcbsService,
  ) {}

  async findAll() {
    return await this.repo.find({ relations: ['pcb', 'component'] });
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['pcb', 'component'],
    });
  }

  async getByPcbs(id: number) {
    try {
      return await this.repo.find({
        where: {
          pcb: { id: id },
        },
        relations: ['pcb', 'component'],
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async generateData() {
    try {
      const pcbsComponents = await this.findAll();
      const data: any[] = [];

      if (!pcbsComponents)
        throw new NotFoundException('Ошибка при поиске компноентов плат');

      pcbsComponents.map((item) => {
        const { pcb, component, ...defaultData } = item;

        const pcbTitle = pcb?.title;
        const componentTitle = component?.title;

        data.push({
          ...defaultData,
          pcbTitle,
          componentTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: PcbsComponentsDTO) {
    try {
      const { componentId, pcbId, ...defaultData } = data;

      const component = await this.componentsService.findOne(componentId);
      const pcb = await this.pcbService.findOne(pcbId);

      if (!component || !pcb)
        throw new NotFoundException('Одна из сущностей не найдена');

      const entity = this.repo.create({
        ...defaultData,
        component: component,
        pcb: pcb,
      } as DeepPartial<PcbsComponents>);

      return await this.repo.save(entity);
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<PcbsComponents>) {
    await this.repo.update(id, data);
    return await this.repo.findOne({ where: { id } });
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
