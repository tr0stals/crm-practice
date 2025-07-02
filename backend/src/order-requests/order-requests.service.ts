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
      relations: ['employeeCreator', 'employeeCreator.peoples', 'factory'],
    });
  }

  async generateData() {
    try {
      const orderRequests = await this.findAll();
      const data: any[] = [];

      if (!orderRequests)
        throw new NotFoundException('Ошибка поиска OrderRequests');

      orderRequests.map((item) => {
        const { employeeCreator, factory, ...defaultData } = item;
        const employeeCreatorName = `${employeeCreator.peoples?.firstName} ${employeeCreator.peoples?.middleName} ${employeeCreator.peoples?.lastName}`;
        const factoryName = factory.shortName;

        data.push({
          ...defaultData,
          employeeCreatorName,
          factoryName,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findOne(id: number): Promise<OrderRequests> {
    const orderRequest = await this.repository.findOne({
      where: { id },
      relations: ['employeeCreator', 'employeeCreator.peoples', 'factory'],
    });
    if (!orderRequest) {
      throw new NotFoundException(`Заявка на заказ с ID ${id} не найдена`);
    }
    return orderRequest;
  }

  async update(
    id: number,
    data: Partial<OrderRequests>,
  ): Promise<OrderRequests> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
