import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRequests } from './order-requests.entity';

@Injectable()
export class OrderRequestsService {
  constructor(
    @InjectRepository(OrderRequests)
    private readonly repository: Repository<OrderRequests>,
  ) {}

  async create(data: Partial<OrderRequests>): Promise<OrderRequests> {
    const orderRequest = this.repository.create(data);
    return await this.repository.save(orderRequest);
  }

  async findAll(): Promise<OrderRequests[]> {
    return await this.repository.find({
      relations: ['stands', 'employeeCreator', 'orderRequestComponents']
    });
  }

  async findOne(id: number): Promise<OrderRequests> {
    const orderRequest = await this.repository.findOne({
      where: { id },
      relations: ['stands', 'employeeCreator', 'orderRequestComponents']
    });
    if (!orderRequest) {
      throw new NotFoundException(`Заявка на заказ с ID ${id} не найдена`);
    }
    return orderRequest;
  }

  async update(id: number, data: Partial<OrderRequests>): Promise<OrderRequests> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
