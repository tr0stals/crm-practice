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
      relations: [
        'pcb',
        'pcbOrderState',
        'pcbManufacturer',
        'factory',
        'employees',
        'employees.peoples',
      ],
    });
  }

  async generateData() {
    try {
      const orders = await this.findAll();
      const data: any[] = [];

      if (!orders)
        throw new NotFoundException('Ошибка поиска состояний заказов плат');

      orders.map((item) => {
        const {
          pcb,
          pcbManufacturer,
          factory,
          employees,
          pcbOrderState,
          ...defaultData
        } = item;
        const pcbTitle = pcb.id;
        const pcbManufacturerName = pcbManufacturer.shortName;
        const factoryName = factory.shortName;
        const employeeName = `${employees.peoples?.firstName} ${employees.peoples?.middleName} ${employees.peoples?.lastName}`;
        const pcbOrderStateTitle = pcbOrderState.state;

        data.push({
          ...defaultData,
          pcbTitle,
          pcbManufacturerName,
          factoryName,
          employeeName,
          pcbOrderStateTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findOne(id: number): Promise<PcbOrders> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: [
        'pcb',
        'pcbOrderState',
        'pcbManufacturer',
        'factory',
        'employees',
        'employees.peoples',
      ],
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
