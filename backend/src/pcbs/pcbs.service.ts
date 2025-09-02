import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { PCBS } from './pcbs.entity';
import { PcbsCategories } from 'src/pcbs_categories/pcbs_categories.entity';
import { PCBSDTO } from './dto/PCBSDTO';
import { ComponentsService } from 'src/components/components.service';
import { StandsService } from 'src/stands/stands.service';

@Injectable()
export class PcbsService {
  constructor(
    @InjectRepository(PCBS)
    private repository: Repository<PCBS>,
    private componentService: ComponentsService,
    private standService: StandsService,
  ) {}

  async create(data: PCBSDTO) {
    try {
      const { componentId, standId, ...defaultData } = data;

      const component = await this.componentService.findOne(componentId);
      const stand = await this.standService.findOne(standId);

      if (!component || !stand)
        throw new NotFoundException('Не найдена одна из сущностей');

      const entity = this.repository.create({
        ...defaultData,
        component: component,
        stands: stand,
      } as DeepPartial<PCBS>);

      return await this.repository.save(entity);
    } catch (e) {
      throw new Error(e);
    }
  }

  async findAll(): Promise<PCBS[]> {
    return await this.repository.find({
      relations: ['stands', 'component'],
    });
  }

  async findOne(id: number): Promise<PCBS> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['stands', 'component'],
    });
    if (!entity) {
      throw new NotFoundException(`Печатная плата с ID ${id} не найдена`);
    }
    return entity;
  }

  async generateData() {
    try {
      const pcbs = await this.findAll();
      const data: any[] = [];

      if (!pcbs) throw new NotFoundException('Ошибка при поиске печатных плат');

      pcbs.map((item) => {
        const { component, stands, ...defaultData } = item;
        const componentTitle = component?.title;
        const standTitle = stands?.title;

        data.push({
          ...defaultData,
          standTitle: standTitle,
          componentTitle: componentTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<PCBS>): Promise<PCBS> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    try {
      await this.findOne(id); // Проверяем существование
      await this.repository.delete(id);
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

  async getPcbsTree() {
    const [pcbs, categories] = await Promise.all([
      this.repository.find({
        relations: ['pcbsComponents', 'pcbsComponents.component'],
      }),
      this.repository.manager.getRepository(PcbsCategories).find({
        relations: ['subcategories'],
      }),
    ]);

    function buildPcbChildren(parentId) {
      return pcbs
        .filter((pcb) => pcb.parentId === parentId)
        .map((pcb) => ({
          id: pcb.id,
          name: pcb.title || `Плата #${pcb.id}`,
          pcbName: pcb.title,
          nodeType: 'pcbs',
          children: Array.isArray(pcb.pcbsComponents)
            ? pcb.pcbsComponents.map((comp) => ({
                name: `${comp.component?.title || `Компонент #${comp.id}`} (${comp.componentCount} шт)`,
                nodeType: 'components',
                componentTitle: comp.component?.title,
                material: comp.component?.material,
                receiptDate: comp.component?.receiptDate,
                id: comp.id,
                componentCount: comp.componentCount,
                component: comp.component,
              }))
            : [],
        }));
    }

    const tree = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      nodeType: 'pcbs_categories',
      children: (cat.subcategories || []).map((subcat) => ({
        id: subcat.id,
        name: subcat.name,
        subcategoryName: subcat.name,
        nodeType: 'pcbs_subcategories',
        children: buildPcbChildren(subcat.id),
      })),
    }));

    return { name: 'Платы', children: tree };
  }
}
