import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Components } from './components.entity';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(Components)
    private repository: Repository<Components>,
  ) {}

  async create(data: Partial<Components>): Promise<Components> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<Components[]> {
    return await this.repository.find({
      relations: [
        'supplierComponents',
        'componentsArrivalInvoice'
      ]
    });
  }

  async findOne(id: number): Promise<Components> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: [
        'supplierComponents',
        'componentsArrivalInvoice'
      ]
    });
    if (!entity) {
      throw new NotFoundException(`Компонент с ID ${id} не найден`);
    }
    return entity;
  }

  async update(id: number, data: Partial<Components>): Promise<Components> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
} 