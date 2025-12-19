import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shipments } from './shipments.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ShipmentsDTO } from './dto/shipmentsDTO';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { LicenseService } from 'src/license/license.service';
import { Stands } from 'src/stands/stands.entity';
import { ShipmentPackage } from 'src/shipment_package/shipment_package.entity';
import { ShipmentsStands } from 'src/shipments_stands/shipments_stands.entity';
import { User } from 'src/user/user.entity';
import { WsGateway } from 'src/websocket/ws.gateway';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotifyUsersService } from 'src/features/notify-users/notify-users.service';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipments)
    private repository: Repository<Shipments>,
    @InjectRepository(Stands)
    private standsRepo: Repository<Stands>,
    @InjectRepository(ShipmentPackage)
    private shipmentPackagesRepo: Repository<ShipmentPackage>,
    @InjectRepository(ShipmentsStands)
    private shipmentStandsRepo: Repository<ShipmentsStands>,
    private organizationService: OrganizationsService,
    private licenseService: LicenseService,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private wsGateway: WsGateway,

    private notificationsService: NotificationsService,

    private notifyUsersService: NotifyUsersService,
  ) {}

  async create(data: ShipmentsDTO) {
    try {
      const { clientId, factoryId, licenseId, transporterId, ...defaultData } =
        data;

      const client = await this.organizationService.getById(clientId);
      const factory = await this.organizationService.getById(factoryId);
      const transporter = await this.organizationService.getById(transporterId);
      const license =
        licenseId && (await this.licenseService.findById(licenseId));

      if (!client || !factory || !transporter)
        throw new NotFoundException('Одна из сущностей не найдена');

      const entity = this.repository.create({
        ...defaultData,
        client: client,
        factory: factory,
        licenses: license,
        transporter: transporter,
      } as DeepPartial<Shipments>);

      const users = await this.userRepo.find({
        relations: ['employees'],
      });

      // await this.notificationsService.notifyUsers(
      //   users.map((u) => u.id),
      //   'Добавлена новая отгрузка (новая версия)',
      //   'success',
      // );

      const shipment = await this.repository.save(entity);

      await this.notifyUsersService.sendNotificationToUsers(
        users.map((u) => u.id),
        {
          message: `Добавлена новая отгрузка №${shipment.id}`,
          type: 'success',
        },
      );

      return shipment;
    } catch (e) {
      console.error('Ошибка при создании записи:', e);
      throw e;
    }
  }

  async update(id: number, data: ShipmentsDTO): Promise<Shipments> {
    try {
      await this.findOne(id);
      await this.repository.update(id, data);
      return await this.findOne(id);
    } catch (e) {
      console.error('Ошибка при обновлении записи', e);
      throw e;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.findOne(id);
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

  async findOne(id: number): Promise<Shipments> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['licenses', 'factory', 'transporter', 'client'],
    });

    if (!entity) throw new NotFoundException(`Поставка с ${id} не найдена`);

    return entity;
  }

  async findAll(): Promise<Shipments[]> {
    try {
      return await this.repository.find({
        relations: ['licenses', 'factory', 'transporter', 'client'],
      });
    } catch (e) {
      console.error('Записи не найдены', e);
      throw e;
    }
  }

  async generateData() {
    try {
      const shipments = await this.findAll();
      const data: any[] = [];
      if (!shipments) throw new NotFoundException('Ошибка при поиске отгрузок');

      shipments.map((item) => {
        const { licenses, factory, transporter, client, ...defaultData } = item;

        const licenseCode = `Лицензия №${licenses?.licenseCode}`;
        const factoryTitle = factory?.shortName;
        const transporterTitle = transporter?.shortName;
        const clientTitle = client?.shortName;

        data.push({
          ...defaultData,
          licenseCode,
          factoryTitle,
          transporterTitle,
          clientTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async #childrenGenerator(shipment: Shipments) {
    const shipmentPackages = await this.shipmentPackagesRepo.find({
      relations: ['shipmentPackageStates', 'shipments'],
    });
    const shipmentStands = await this.shipmentStandsRepo.find({
      relations: ['shipments', 'stands', 'stands.standType'],
    });

    const children = [
      ...shipmentStands
        .filter((item) => item.shipments?.id === shipment.id)
        .map((item) => ({
          id: item?.id,
          name: `Стенд: ${item.stands?.title ? item.stands?.title : 'Неизвестный стенд'} | ${item.stands?.standType?.title ? item.stands?.standType?.title : 'Неизвестный тип стенда'} `,
          nodeType: 'shipments_stands',
        })),
      ...shipmentPackages
        .filter((item) => item.shipments?.id === shipment.id)
        .map((item) => ({
          id: item.id,
          name: `Номер упаковки: ${item.id}`,
          nodeType: 'shipment_package',
        })),
    ];

    return children;
  }

  async getTree() {
    const shipments = await this.findAll();

    if (!shipments) throw new NotFoundException('Ошибка при поиске отгрузок');

    const tree = await Promise.all(
      shipments.map(async (shipment: Shipments) => {
        const children = await this.#childrenGenerator(shipment);

        return {
          id: shipment.id,
          name: `${shipment.client?.shortName} | Дата отгрузки: ${shipment.shipmentDate ? shipment.shipmentDate : 'Дата отгрузки не указана'}`,
          nodeType: 'shipments',
          children,
        };
      }),
    );

    return { name: 'Отгрузки', children: tree };
  }
}
