import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRequestComponents } from './order-request-components.entity';

@Injectable()
export class OrderRequestComponentsService {
  constructor(
    @InjectRepository(OrderRequestComponents)
    private readonly repo: Repository<OrderRequestComponents>,
  ) {}

  async create(data: Partial<OrderRequestComponents>): Promise<OrderRequestComponents> {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async findAll(): Promise<OrderRequestComponents[]> {
    return await this.repo.find({
      relations: ['component', 'orderRequests']
    });
  }

  async findOne(id: number): Promise<OrderRequestComponents> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['component', 'orderRequests']
    });
    if (!entity) {
      throw new NotFoundException(`Компонент заявки на заказ с ID ${id} не найден`);
    }
    return entity;
  }

  async update(id: number, data: Partial<OrderRequestComponents>): Promise<OrderRequestComponents> {
    await this.findOne(id); // Проверяем существование
    await this.repo.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repo.delete(id);
  }
} 