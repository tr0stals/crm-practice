import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComponentsArrivalInvoice } from './components_arrival_invoice.entity';

@Injectable()
export class ComponentsArrivalInvoiceService {
  constructor(
    @InjectRepository(ComponentsArrivalInvoice)
    private repository: Repository<ComponentsArrivalInvoice>,
  ) {}

  async create(data: Partial<ComponentsArrivalInvoice>): Promise<ComponentsArrivalInvoice> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<ComponentsArrivalInvoice[]> {
    return await this.repository.find({
      relations: [
        'component',
        'invoice'
      ]
    });
  }

  async findOne(id: number): Promise<ComponentsArrivalInvoice> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: [
        'component',
        'invoice'
      ]
    });
    if (!entity) {
      throw new NotFoundException(`Счет-фактура на поставку компонента с ID ${id} не найден`);
    }
    return entity;
  }

  async update(id: number, data: Partial<ComponentsArrivalInvoice>): Promise<ComponentsArrivalInvoice> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}