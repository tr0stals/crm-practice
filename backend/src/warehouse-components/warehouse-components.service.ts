import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseComponents } from './warehouse-components.entity';

@Injectable()
export class WarehouseComponentsService {
  constructor(
    @InjectRepository(WarehouseComponents)
    private repository: Repository<WarehouseComponents>,
  ) {}

  async create(data: Partial<WarehouseComponents>): Promise<WarehouseComponents> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<WarehouseComponents[]> {
    return await this.repository.find({
      relations: ['orderRequestComponents', 'pcbWarehouseComponents', 'organizations']
    });
  }

  async findOne(id: number): Promise<WarehouseComponents> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['orderRequestComponents', 'pcbWarehouseComponents', 'organizations']
    });
    if (!entity) {
      throw new NotFoundException(`Компонент на складе с ID ${id} не найден`);
    }
    return entity;
  }

  async update(id: number, data: Partial<WarehouseComponents>): Promise<WarehouseComponents> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
