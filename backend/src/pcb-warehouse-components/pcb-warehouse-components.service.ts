import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PcbWarehouseComponents } from './pcb-warehouse-components.entity';

@Injectable()
export class PcbWarehouseComponentsService {
  constructor(
    @InjectRepository(PcbWarehouseComponents)
    private repository: Repository<PcbWarehouseComponents>,
  ) {}

  async create(data: Partial<PcbWarehouseComponents>): Promise<PcbWarehouseComponents> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<PcbWarehouseComponents[]> {
    return await this.repository.find({
      relations: ['warehouseComponents', 'pcbs']
    });
  }

  async findOne(id: number): Promise<PcbWarehouseComponents> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['warehouseComponents', 'pcbs']
    });
    if (!entity) {
      throw new NotFoundException(`Компонент ПП на складе с ID ${id} не найден`);
    }
    return entity;
  }

  async update(id: number, data: Partial<PcbWarehouseComponents>): Promise<PcbWarehouseComponents> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
