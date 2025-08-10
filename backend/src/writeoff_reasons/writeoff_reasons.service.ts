import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WriteoffReasons } from './writeoff_reasons.entity';

@Injectable()
export class WriteoffReasonsService {
  constructor(
    @InjectRepository(WriteoffReasons)
    private readonly repo: Repository<WriteoffReasons>,
  ) {}

  async getAll() {
    return this.repo.find();
  }

  async getOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async generateData() {
    try {
      const reasons = await this.getAll();
      const data: any[] = [];

      if (!reasons)
        throw new NotFoundException('Ошибка при поиске причин списания');

      reasons.map((item) => {
        data.push({
          ...item,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: Partial<WriteoffReasons>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<WriteoffReasons>) {
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
