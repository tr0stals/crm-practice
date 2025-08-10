import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandsTypes } from './stand_types.entity';

@Injectable()
export class StandTypesService {
  constructor(
    @InjectRepository(StandsTypes)
    private readonly repository: Repository<StandsTypes>,
  ) {}

  create(data: Partial<StandsTypes>) {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  findAll() {
    return this.repository.find();
  }

  async generateData() {
    try {
      const types = await this.findAll();
      const data: any[] = [];

      if (!types)
        throw new NotFoundException('Ошибка при поиске типов стендов');

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

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  update(id: number, data: Partial<StandsTypes>) {
    return this.repository.update(id, data);
  }

  async remove(id: number) {
    try {
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
