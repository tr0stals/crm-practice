import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ShipmentPackage } from './shipment_package.entity';
import { ShipmentPackageDTO } from './dto/shipmentPackageDTO';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { ShipmentPackageStatesService } from 'src/shipment_package_states/shipment_package_states.service';

@Injectable()
export class ShipmentPackageService {
  constructor(
    @InjectRepository(ShipmentPackage)
    private repository: Repository<ShipmentPackage>,
    private shipmentService: ShipmentsService,
    private shipmentPackageStateService: ShipmentPackageStatesService,
  ) {}

  async create(data: ShipmentPackageDTO) {
    try {
      const { shipmentId, stateId, ...defaultData } = data;

      const shipment = await this.shipmentService.findOne(shipmentId);
      const shipmentPackageState =
        await this.shipmentPackageStateService.findOne(stateId);

      if (!shipment || !shipmentPackageState)
        throw new NotFoundException('Одна из сущностей не найдена');

      const entity = this.repository.create({
        ...defaultData,
        shipmentPackageStates: shipmentPackageState,
        shipments: shipment,
      } as DeepPartial<ShipmentPackage>);

      return await this.repository.save(entity);
    } catch (e) {
      console.error('Ошибка при создании записи', e);
      throw e;
    }
  }

  async generateData() {
    try {
      const packages = await this.findAll();
      const data: any[] = [];

      if (!packages)
        throw new NotFoundException('Ошибка при поиске ящиков отправок');

      packages.map((item) => {
        const { shipments, shipmentPackageStates, ...defaultData } = item;
        const shipmentDate = shipments?.shipmentDate;
        const shipmentPackageStateTitle = shipmentPackageStates?.title;

        data.push({
          ...defaultData,
          shipmentDate,
          shipmentPackageStateTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: ShipmentPackageDTO): Promise<ShipmentPackage> {
    try {
      await this.findOne(id);
      await this.repository.update(id, data);
      return await this.findOne(id);
    } catch (e) {
      console.error('ошибка при обновлении записи', e);
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

  async findOne(id: number): Promise<ShipmentPackage> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['shipmentPackageStates', 'shipments'],
    });

    if (!entity) throw new NotFoundException(`Ящик отправок с ${id} не найден`);

    return entity;
  }

  async findAll(): Promise<ShipmentPackage[]> {
    try {
      return await this.repository.find({
        relations: ['shipmentPackageStates', 'shipments'],
      });
    } catch (e) {
      console.error('Ящики отправок не найдены', e);
      throw e;
    }
  }
}
