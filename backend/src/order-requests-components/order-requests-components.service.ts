import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRequestsComponents } from './order-requests-components.entity';

@Injectable()
export class OrderRequestsComponentsService {
  constructor(
    @InjectRepository(OrderRequestsComponents)
    private repository: Repository<OrderRequestsComponents>,
  ) {}

  async create(
    data: Partial<OrderRequestsComponents>,
  ): Promise<OrderRequestsComponents> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<OrderRequestsComponents[]> {
    return await this.repository.find({
      relations: ['component', 'orderRequests', 'supplier'],
    });
  }

  async generateData() {
    try {
      const orderRequestComponents = await this.findAll();
      const data: any[] = [];

      if (!orderRequestComponents)
        throw new NotFoundException('Ошибка поиска OrderRequestComponents');

      orderRequestComponents.map((item) => {
        const { component, supplier, orderRequests, ...defaultData } = item;
        const componentTitle = component.title;
        const supplierTitle = supplier.shortName;
        const orderRequestTitle = orderRequests.title;

        data.push({
          ...defaultData,
          supplierTitle,
          componentTitle,
          orderRequestTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findOne(id: number): Promise<OrderRequestsComponents> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['component', 'orderRequests', 'supplier'],
    });
    if (!entity) {
      throw new NotFoundException(
        `Компонент заявки на заказ с ID ${id} не найден`,
      );
    }
    return entity;
  }

  async update(
    id: number,
    data: Partial<OrderRequestsComponents>,
  ): Promise<OrderRequestsComponents> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
