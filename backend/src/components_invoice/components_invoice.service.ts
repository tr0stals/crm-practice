import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComponentsInvoice } from './components_invoice.entity';

@Injectable()
export class ComponentsInvoiceService {
  constructor(
    @InjectRepository(ComponentsInvoice)
    private repository: Repository<ComponentsInvoice>,
  ) {}

  async create(data: Partial<ComponentsInvoice>): Promise<ComponentsInvoice> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<ComponentsInvoice[]> {
    return await this.repository.find({
      relations: ['component', 'invoice']
    });
  }

  async findOne(id: number): Promise<ComponentsInvoice> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['component', 'invoice']
    });
    if (!entity) {
      throw new NotFoundException(`Счет за компонент с ID ${id} не найден`);
    }
    return entity;
  }

  async update(id: number, data: Partial<ComponentsInvoice>): Promise<ComponentsInvoice> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}