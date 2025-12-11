import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComponentPlacementType } from './component_placement_type.entity';
import { ComponentPlacementTypeDTO } from './dto/ComponentPlacementTypeDTO';

@Injectable()
export class ComponentPlacementTypeService {
  constructor(
    @InjectRepository(ComponentPlacementType)
    private readonly repo: Repository<ComponentPlacementType>,
  ) {}

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id } });
  }

  async generateData() {
    try {
      const types = await this.findAll();
      const data: any[] = [];

      if (!types) throw new NotFoundException('Ошибка поиска типов размещений');

      types.map((item) => {
        data.push({
          ...item,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getByComponentPlacementType(placementTypeId: number) {
    try {
      return await this.repo.findOne({
        where: {
          id: placementTypeId,
        },
      });
    } catch (e) {
      throw new NotFoundException('Ошибка при поиске componentPlacement');
    }
  }

  async create(data: ComponentPlacementTypeDTO) {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async update(id: number, data: ComponentPlacementTypeDTO) {
    await this.repo.update(id, data);
    return await this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
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
