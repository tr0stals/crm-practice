import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { OrderRequests } from './order_requests.entity';
import { OrderRequestsDTO } from './dto/OrderRequestsDTO';
import { EmployeesService } from 'src/employees/employees.service';
import { StandsService } from 'src/stands/stands.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { OrderRequestsComponents } from 'src/order_requests_components/order_requests_components.entity';

@Injectable()
export class OrderRequestsService {
  constructor(
    @InjectRepository(OrderRequests)
    private readonly repository: Repository<OrderRequests>,
    @InjectRepository(OrderRequestsComponents)
    private orderRequestsComponentsRepo: Repository<OrderRequestsComponents>,
    private employeeService: EmployeesService,
    private standService: StandsService,
    private organizationService: OrganizationsService,
  ) {}

  async create(data: OrderRequestsDTO) {
    try {
      const { employeeCreatorId, factoryId, standId, ...defaultData } = data;

      const employeeCreator =
        await this.employeeService.findById(employeeCreatorId);

      const factory = await this.organizationService.getById(factoryId);
      const stand = await this.standService.findOne(standId);

      if (!employeeCreator || !factory || !stand)
        throw new NotFoundException('Нет одной из сущностей');

      const entity = this.repository.create({
        ...defaultData,
        employeeCreator: employeeCreator,
        factory: factory,
        stands: stand,
      } as DeepPartial<OrderRequests>);

      return await this.repository.save(entity);
    } catch (e) {
      throw new Error(e);
    }
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
        const factoryName = factory?.shortName;

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

  async getTree() {
    try {
      const order_requests_components =
        await this.orderRequestsComponentsRepo.find({
          relations: ['orderRequests', 'component', 'supplier'],
        });

      const orderRequests = await this.findAll();

      if (!orderRequests) throw new NotFoundException('Ошибка поиска заявок');

      if (!order_requests_components)
        throw new NotFoundException('Ошибка поиска компонентов на заявку');

      const tree = orderRequests.map((item: OrderRequests) => ({
        id: item.id,
        name: item.title,
        nodeType: 'order_requests',
        children: order_requests_components
          .filter((component) => component.orderRequests?.id === item.id)
          .map((component: OrderRequestsComponents) => {
            return {
              id: component.id,
              name: `${component.component?.title} | ${component.supplier?.shortName}`,
              nodeType: 'order_requests_components',
            };
          }),
      }));

      return { name: 'Заявки на заказ', children: tree };
    } catch (e) {
      throw new Error(e);
    }
  }
}
