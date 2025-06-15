import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderTypes } from './order-types.entity';

@Injectable()
export class OrderTypesService {
  constructor(
    @InjectRepository(OrderTypes)
    private readonly repository: Repository<OrderTypes>,
  ) {}

  async create(data: Partial<OrderTypes>): Promise<OrderTypes> {
    const orderType = this.repository.create(data);
    return await this.repository.save(orderType);
  }

  async findAll(): Promise<OrderTypes[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<OrderTypes> {
    const orderType = await this.repository.findOne({ where: { id } });
    if (!orderType) {
      throw new NotFoundException(`Тип заказа с ID ${id} не найден`);
    }
    return orderType;
  }

  async update(id: number, data: Partial<OrderTypes>): Promise<OrderTypes> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
