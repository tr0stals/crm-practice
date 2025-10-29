import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WriteoffReasons } from './writeoff_reasons.entity';

@Injectable()
export class WriteoffReasonsService implements OnModuleInit {
  constructor(
    @InjectRepository(WriteoffReasons)
    private readonly repo: Repository<WriteoffReasons>,
  ) {}

  async onModuleInit() {
    await this.ensureSystemReasons();
  }

  private readonly SYSTEM_REASONS = [
    'Утеря',
    'Повреждение',
    'Брак',
    'Истечение срока годности',
  ];

  private async ensureSystemReasons() {
    const existing = await this.repo.find({
      where: this.SYSTEM_REASONS.map((title) => ({ title })),
      select: ['id', 'title'],
    });

    const existingSet = new Set(existing.map((e) => e.title));

    const toCreate = this.SYSTEM_REASONS
      .filter((title) => !existingSet.has(title))
      .map((title) => this.repo.create({ title }));

    if (toCreate.length > 0) {
      await this.repo.save(toCreate);
    }
  }

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
    try {
      const existing = await this.repo.findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Причина списания не найдена');

      if (this.SYSTEM_REASONS.includes(existing.title)) {
        throw new ForbiddenException('Системную причину списания нельзя изменять');
      }

      await this.repo.update(id, data);
      return this.getOne(id);
    } catch (e) {
      console.error('Ошибка при изменении причины списания!', e);
      throw e;
    }
  }

  async delete(id: number) {
    try {
      const existing = await this.repo.findOne({ where: { id } });
      if (!existing) throw new NotFoundException('Причина списания не найдена');

      if (this.SYSTEM_REASONS.includes(existing.title)) {
        throw new ForbiddenException('Системную причину списания нельзя удалять');
      }

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
      console.error('Ошибка при удалении причины списания!', e);
      throw e;
    }
  }
}
