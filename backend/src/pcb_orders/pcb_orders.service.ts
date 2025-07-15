import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PcbOrders } from './pcb_orders.entity';
import { PCBS } from '../pcbs/pcbs.entity';
import { PCB_CATEGORIES } from '../pcbs/pcbs_categories';

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
        const pcbTitle = pcb.title;
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

  async getPcbOrdersTree() {
    // Получаем все заказы с нужными связями
    const orders = await this.repository.find({
      relations: ['pcb', 'pcbManufacturer', 'factory', 'pcbOrderState'],
      order: { orderDate: 'DESC' },
    });

    // Получаем все платы для сопоставления parentId -> subcategory
    const pcbIdToSubcategory = {};
    const pcbIdToName = {};
    // Для простоты — получаем все платы через отдельный запрос
    // (в реальном проекте лучше через сервис PCBS, но тут напрямую)
    const pcbsRepo = this.repository.manager.getRepository(PCBS);
    const allPcbs = await pcbsRepo.find();
    allPcbs.forEach((pcb) => {
      pcbIdToSubcategory[pcb.id] = pcb.parentId;
      pcbIdToName[pcb.id] = pcb.id;
    });

    // Мапа: subcategoryId -> subcategoryName
    const subcategoryIdToName = {};
    PCB_CATEGORIES.forEach((cat) => {
      cat.subcategories.forEach((subcat) => {
        subcategoryIdToName[subcat.id] = subcat.name;
      });
    });

    // Группируем по дате
    const grouped = {};
    for (const order of orders) {
      const date = order.orderDate ? String(order.orderDate) : 'Без даты';
      if (!grouped[date]) grouped[date] = [];

      // Получаем subcategoryName
      const pcb = order.pcb;
      const subcategoryId = pcbIdToSubcategory[pcb?.id];
      const subcategoryName = subcategoryIdToName[subcategoryId] || '';
      const pcbName = pcb?.title || pcb?.id || '';
      const pcbPrice = `${order.price} руб.` || '0 руб.';
      const widthHeight = `${order.width}x${order.height} мм`;
      const count = `${order.count} шт.`;
      // Формируем строку для дерева (оставляем, но закомментируем)
      // const row = [
      //   order.pcbManufacturer?.fullName,
      //   order.factory?.fullName,
      //   subcategoryName,
      //   pcbName,
      //   count,
      //   widthHeight,
      //   order.article,
      //   order.price,
      //   order.pcbOrderState?.state
      // ].join(' | ');
      const rowObj = {
        id: order.id,
        nodeType: 'pcb_orders',
        name: [
          `Производитель: ${order.pcbManufacturer?.fullName}`,
          `Завод: ${order.factory?.fullName}`,
          `Подкатегория: ${subcategoryName}`,
          `Плата: ${pcbName}`,
          `${count}`,
          `${widthHeight}`,
          `Артикул: ${order.article}`,
          `${pcbPrice}`,
          `Статус: ${order.pcbOrderState?.state}`,
        ].join(' | '),
        manufacturer: order.pcbManufacturer?.fullName,
        factory: order.factory?.fullName,
        subcategoryName,
        pcbName,
        count,
        width: order.width,
        height: order.height,
        article: order.article,
        price: order.price,
        status: order.pcbOrderState?.state,
        orderDate: order.orderDate,
      };
      grouped[date].push(rowObj);
    }

    // Формируем объект для TreeView
    return {
      name: 'Заказы печатных плат',
      children: Object.entries(grouped).map(([date, orders]) => ({
        name: date,
        children: (orders as any[]).map((orderObj) => ({
          ...orderObj,
          children: [],
        })),
      })),
    };
  }
}
