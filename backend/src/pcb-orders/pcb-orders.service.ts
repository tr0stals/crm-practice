import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PcbOrders } from './pcb-orders.entity';

@Injectable()
export class PcbOrdersService {
  constructor(
    @InjectRepository(PcbOrders)
    private repository: Repository<PcbOrders>,
  ) {}

  async create(data: Partial<PcbOrders>): Promise<PcbOrders> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<PcbOrders[]> {
    return await this.repository.find({
      relations: ['pcb', 'pcbOrderState', 'pcbManufacturer', 'factory', 'employees']
    });
  }

  async findOne(id: number): Promise<PcbOrders> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['pcb', 'pcbOrderState', 'pcbManufacturer', 'factory', 'employees']
    });
    if (!entity) {
      throw new NotFoundException(`Заказ ПП с ID ${id} не найден`);
    }
    return entity;
  }

  async update(id: number, data: Partial<PcbOrders>): Promise<PcbOrders> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
