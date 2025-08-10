import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { OrderRequestsComponents } from './order_requests_components.entity';
import { OrderRequestsComponentsDTO } from './dto/OrderRequestsComponentsDTO';
import { ComponentsService } from 'src/components/components.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { OrderRequestsService } from 'src/order_requests/order_requests.service';

@Injectable()
export class OrderRequestsComponentsService {
  constructor(
    @InjectRepository(OrderRequestsComponents)
    private repository: Repository<OrderRequestsComponents>,
    private componentService: ComponentsService,
    private organizationService: OrganizationsService,
    private orderRequestService: OrderRequestsService,
  ) {}

  async create(data: OrderRequestsComponentsDTO) {
    try {
      const { componentId, supplierId, orderRequestId, ...defaultData } = data;

      const component = await this.componentService.findOne(componentId);
      const supplier = await this.organizationService.getById(supplierId);
      const orderRequest =
        await this.orderRequestService.findOne(orderRequestId);

      if (!component || !supplier || !orderRequest)
        throw new Error('Нет одной из сущностей');

      const entity = this.repository.create({
        ...defaultData,
        component: component,
        orderRequests: orderRequest,
        supplier: supplier,
      } as DeepPartial<OrderRequestsComponents>);

      return await this.repository.save(entity);
    } catch (e) {
      throw new Error(e);
    }
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
        const componentTitle = component?.title;
        const supplierTitle = supplier?.shortName;
        const orderRequestTitle = orderRequests?.title;

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
}
