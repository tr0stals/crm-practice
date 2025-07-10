import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierComponents } from './supplier_components.entity';

@Injectable()
export class SupplierComponentsService {
  constructor(
    @InjectRepository(SupplierComponents)
    private repository: Repository<SupplierComponents>,
  ) {}

  async create(data: Partial<SupplierComponents>): Promise<SupplierComponents> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<SupplierComponents[]> {
    return await this.repository.find({
      relations: ['supplier', 'component'],
    });
  }

  async generateData() {
    try {
    } catch (e) {
      throw new Error(e);
    }
  }

  async findOne(id: number): Promise<SupplierComponents> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['supplier', 'component'],
    });
    if (!entity) {
      throw new NotFoundException(`Компонент поставщика с ID ${id} не найден`);
    }
    return entity;
  }

  async update(
    id: number,
    data: Partial<SupplierComponents>,
  ): Promise<SupplierComponents> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
