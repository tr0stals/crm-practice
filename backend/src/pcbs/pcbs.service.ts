import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PCBS } from './pcbs.entity';
import { PCB_CATEGORIES } from './pcbs-categories';

@Injectable()
export class PcbsService {
  constructor(
    @InjectRepository(PCBS)
    private repository: Repository<PCBS>,
  ) {}

  async create(data: Partial<PCBS>): Promise<PCBS> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<PCBS[]> {
    return await this.repository.find({
      relations: ['pcbOrders', 'stands', 'component']
    });
  }

  async findOne(id: number): Promise<PCBS> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['pcbOrders', 'stands', 'component']
    });
    if (!entity) {
      throw new NotFoundException(`Печатная плата с ID ${id} не найдена`);
    }
    return entity;
  }

  async update(id: number, data: Partial<PCBS>): Promise<PCBS> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }

  async getPcbsTree() {
    const pcbs = await this.repository.find({ relations: ['pcbsComponents', 'pcbsComponents.component'] });
  
    function buildPcbChildren(parentId) {
      return pcbs
        .filter(pcb => pcb.parentId === parentId)
        .map(pcb => ({
          name: `Плата #${pcb.id}`,
          children: Array.isArray(pcb.pcbsComponents)
            ? pcb.pcbsComponents.map(comp => ({
                name: `${comp.component?.title || `Компонент #${comp.id}`} (${comp.componentCount} шт)`,
                id: comp.id,
                componentCount: comp.componentCount,
                component: comp.component,
              }))
            : [],
        }));
    }
  
    const tree = PCB_CATEGORIES.map(cat => ({
      name: cat.name,
      children: cat.subcategories.map(subcat => ({
        name: subcat.name,
        children: buildPcbChildren(subcat.id),
      })),
    }));
  
    return { name: 'Платы', children: tree };
  }
}
