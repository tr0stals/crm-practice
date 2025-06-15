import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRequestComponents } from './order-request-components.entity';

@Injectable()
export class OrderRequestComponentsService {
  constructor(
    @InjectRepository(OrderRequestComponents)
    private repository: Repository<OrderRequestComponents>,
  ) {}

  async create(data: Partial<OrderRequestComponents>): Promise<OrderRequestComponents> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<OrderRequestComponents[]> {
    return await this.repository.find({
      relations: ['components', 'orderRequests']
    });
  }

  async findOne(id: number): Promise<OrderRequestComponents> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['components', 'orderRequests']
    });
    if (!entity) {
      throw new NotFoundException(`Компонент заявки на заказ с ID ${id} не найден`);
    }
    return entity;
  }

  async update(id: number, data: Partial<OrderRequestComponents>): Promise<OrderRequestComponents> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
