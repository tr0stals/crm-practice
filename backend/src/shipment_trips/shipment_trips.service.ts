import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShipmentTrips } from './shipment_trips.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ShipmentTripsDTO } from './dto/ShipmentTripsDTO';
import { EmployeesService } from 'src/employees/employees.service';
import { ShipmentsService } from 'src/shipments/shipments.service';

@Injectable()
export class ShipmentTripsService {
  constructor(
    @InjectRepository(ShipmentTrips)
    private repository: Repository<ShipmentTrips>,
    private employeeService: EmployeesService,
    private shipmentService: ShipmentsService,
  ) {}

  async create(data: ShipmentTripsDTO) {
    try {
      const { employeeId, shipmentId, ...defaultData } = data;

      const employee = await this.employeeService.findById(employeeId);
      const shipment = await this.shipmentService.findOne(shipmentId);

      if (!employee || !shipment)
        throw new NotFoundException('Одна из сущностей не найдена');

      const entity = this.repository.create({
        ...defaultData,
        employees: employee,
        shipments: shipment,
      } as DeepPartial<ShipmentTrips>);

      return await this.repository.save(entity);
    } catch (e) {
      console.error('Ошибка при создании Командировки отправок', e);
      throw e;
    }
  }

  async update(id: number, data: ShipmentTripsDTO): Promise<ShipmentTrips> {
    try {
      await this.findOne(id);
      await this.repository.update(id, data);
      return await this.findOne(id);
    } catch (e) {
      console.error('Ошибка при обновлении командировке отправок', e);
      throw e;
    }
  }

  async generateData() {
    try {
      const trips = await this.findAll();
      const data: any[] = [];

      if (!trips) throw new NotFoundException('Ошибка при поиске маршрутов');

      trips.map((item) => {
        const { employees, shipments, ...defaultData } = item;

        const employeeName = `${employees.peoples?.firstName} ${employees.peoples?.middleName} ${employees.peoples?.lastName}`;
        const shipmentDate = shipments?.shipmentDate;

        data.push({
          ...defaultData,
          employeeName,
          shipmentDate,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
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

  async findAll(): Promise<ShipmentTrips[]> {
    try {
      return await this.repository.find({
        relations: ['shipments', 'employees', 'employees.peoples'],
      });
    } catch (e) {
      console.error('Командировки отправок не найдены', e);
      throw e;
    }
  }

  async findOne(id: number): Promise<ShipmentTrips> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['shipments', 'employees', 'employees.peoples'],
    });

    if (!entity) throw new NotFoundException(`Командировка с ${id} не найдена`);

    return entity;
  }
}
