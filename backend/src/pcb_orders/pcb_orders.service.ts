import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PcbOrders } from './pcb_orders.entity';
import { PCBS } from '../pcbs/pcbs.entity';
import { PcbOrdersDTO } from './dto/PcbOrdersDTO';
import { EmployeesService } from 'src/employees/employees.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { PcbOrderStatesService } from 'src/pcb_order_states/pcb_order_states.service';
import { PcbsService } from 'src/pcbs/pcbs.service';

@Injectable()
export class PcbOrdersService {
  constructor(
    @InjectRepository(PcbOrders)
    private repository: Repository<PcbOrders>,
    private employeeService: EmployeesService,
    private organizationService: OrganizationsService,
    private pcbOrderStateService: PcbOrderStatesService,
    private pcbService: PcbsService,
  ) {}

  async create(data: PcbOrdersDTO) {
    try {
      const {
        employeeId,
        factoryId,
        pcbManufacturerId,
        pcbOrderStatusId,
        pcbId,
        ...defaultData
      } = data;

      const employee = await this.employeeService.findById(employeeId);
      const factory = await this.organizationService.getById(factoryId);
      const pcbManufacturer =
        await this.organizationService.getById(pcbManufacturerId);

      const pcbOrderState =
        await this.pcbOrderStateService.findOne(pcbOrderStatusId);

      const pcb = await this.pcbService.findOne(pcbId);

      if (!employee || !factory || !pcbManufacturer || !pcbOrderState || !pcb)
        throw new NotFoundException('Нет одной из сущностей');

      const entity = this.repository.create({
        ...defaultData,
        employees: employee,
        factory: factory,
        pcbManufacturer: pcbManufacturer,
        pcbOrderState: pcbOrderState,
        pcb: pcb,
      });

      return await this.repository.save(entity);
    } catch (e) {
      throw new Error(e);
    }
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
        const pcbTitle = pcb?.title;
        const pcbManufacturerName = pcbManufacturer?.shortName;
        const factoryName = factory?.shortName;
        const employeeName = `${employees.peoples?.firstName} ${employees.peoples?.middleName} ${employees.peoples?.lastName}`;
        const pcbOrderStateTitle = pcbOrderState?.state;

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
    try {
      await this.findOne(id); // Проверяем существование
      await this.repository.delete(id);
    } catch (e: any) {
      if (e.code === 'ER_ROW_IS_REFERENCED_2') {
        const match = e.sqlMessage.match(/`([^`]+)`\.`([^`]+)`/);
        let tableName = match ? match[2] : '';

        throw new HttpException(
          {
            message: `Невозможно удалить запись. Есть связанные записи в таблице "${tableName}". Удалите их сначала.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw e;
    }
  }

  async getPcbOrdersTree() {
    // Получаем все заказы с нужными связями
    const orders = await this.repository.find({
      relations: ['pcb', 'pcbManufacturer', 'factory', 'pcbOrderState'],
      order: { orderDate: 'DESC' },
    });

    // Получаем все платы с компонентами для сопоставления parentId -> subcategory
    const pcbIdToSubcategory = {};
    const pcbIdToName = {};
    const pcbIdToComponents = {};

    // Получаем все платы с их компонентами
    const pcbsRepo = this.repository.manager.getRepository(PCBS);
    const pcbsComponentsRepo =
      this.repository.manager.getRepository('PcbsComponents');

    const allPcbs = await pcbsRepo.find();
    const allPcbComponents = await pcbsComponentsRepo.find({
      relations: ['component', 'pcb'],
    });

    // Группируем компоненты по платам
    allPcbComponents.forEach((pcbComp) => {
      const pcbId = pcbComp.pcb?.id;
      if (pcbId) {
        if (!pcbIdToComponents[pcbId]) {
          pcbIdToComponents[pcbId] = [];
        }
        pcbIdToComponents[pcbId].push({
          name: `${pcbComp.component?.title || 'Неизвестная компонента'} | ${pcbComp.componentCount} шт.`,
          nodeType: 'components',
          componentTitle: pcbComp.component?.title,
          componentCount: pcbComp.componentCount,
          id: pcbComp.id,
          component: pcbComp.component,
        });
      }
    });

    allPcbs.forEach((pcb) => {
      pcbIdToSubcategory[pcb.id] = pcb.parentId;
      pcbIdToName[pcb.id] = pcb.id;
    });

    // Мапа: subcategoryId -> subcategoryName из БД - categories удалены
    const subcategoryIdToName: Record<number, string> = {};

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

      // Создаем объект заказа
      const orderObj = {
        id: order.id,
        nodeType: 'pcb_orders',
        name: [
          `Производитель: ${order.pcbManufacturer?.fullName}`,
          `Завод: ${order.factory?.fullName}`,
          `Подкатегория: ${subcategoryName}`,
          `${count}`,
          `${widthHeight}`,
          `Артикул: ${order.article}`,
          `${pcbPrice}`,
          `Статус: ${order.pcbOrderState?.state}`,
        ].join(' | '),
        manufacturer: order.pcbManufacturer?.fullName,
        factory: order.factory?.fullName,
        subcategoryName,
        count,
        width: order.width,
        height: order.height,
        article: order.article,
        price: order.price,
        status: order.pcbOrderState?.state,
        orderDate: order.orderDate,
        children: [
          {
            name: pcbName,
            nodeType: 'pcbs',
            pcbTitle: pcbName,
            id: pcb?.id,
            pcb: pcb,
            children: pcbIdToComponents[pcb?.id] || [],
          },
        ],
      };

      grouped[date].push(orderObj);
    }

    // Формируем объект для TreeView
    return {
      name: 'Заказы печатных плат',
      children: Object.entries(grouped).map(([date, orders]) => ({
        name: date,
        children: orders as any[],
      })),
    };
  }
}
