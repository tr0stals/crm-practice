import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ShipmentsStands } from './shipments_stands.entity';
import { ShipmentsStandsDTO } from './dto/ShipmentsStandsDTO';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { StandsService } from 'src/stands/stands.service';

@Injectable()
export class ShipmentsStandsService {
  constructor(
    @InjectRepository(ShipmentsStands)
    private repo: Repository<ShipmentsStands>,
    private shipmentService: ShipmentsService,
    private standService: StandsService,
  ) {}

  async create(data: ShipmentsStandsDTO) {
    try {
      const { shipmentId, standId, ...defaultData } = data;

      const shipment = await this.shipmentService.findOne(shipmentId);
      const stand = await this.standService.findOne(standId);

      if (!shipment || !stand)
        throw new NotFoundException('Одна из сущностей не найдена');

      const entity = this.repo.create({
        ...defaultData,
        shipments: shipment,
        stands: stand,
      } as DeepPartial<ShipmentsStands>);

      return await this.repo.save(entity);
    } catch (e) {
      throw new Error(e);
    }
  }

  async getAll() {
    return await this.repo.find({
      relations: ['shipments', 'stands'],
    });
  }

  async generateData() {
    try {
      const shipmentStands = await this.getAll();
      const data: any[] = [];

      if (!shipmentStands)
        throw new NotFoundException('Ошибка поиска ShipmentsStands');

      shipmentStands.map((item) => {
        const { shipments, stands, ...defaultData } = item;
        const shipmentDate = shipments?.shipmentDate;
        const standTitle = stands?.title;

        data.push({
          ...defaultData,
          shipmentDate,
          standTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['shipments', 'stands'],
    });
  }

  async update(id: number, data: Partial<ShipmentsStands>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    try {
      await this.repo.delete(id);
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
