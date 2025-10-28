import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PcbOrderStates } from './pcb_order_states.entity';

@Injectable()
export class PcbOrderStatesService implements OnModuleInit {
  constructor(
    @InjectRepository(PcbOrderStates)
    private repository: Repository<PcbOrderStates>,
  ) {}

  async onModuleInit() {
    await this.ensureSystemStates();
  }

  private readonly SYSTEM_STATES = ['Новый', 'Не оплачен', 'Оплачен', 'Отменен'];

  private async ensureSystemStates() {
    const existing = await this.repository.find({
      where: this.SYSTEM_STATES.map((state) => ({ state })),
      select: ['id', 'state'],
    });

    const existingSet = new Set(existing.map((e) => e.state));

    const toCreate = this.SYSTEM_STATES
      .filter((state) => !existingSet.has(state))
      .map((state) => this.repository.create({ state }));

    if (toCreate.length > 0) {
      await this.repository.save(toCreate);
    }
  }

  async create(data: Partial<PcbOrderStates>): Promise<PcbOrderStates> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<PcbOrderStates[]> {
    return await this.repository.find({});
  }

  async generateData() {
    try {
      const states = await this.findAll();
      const data: any[] = [];

      if (!states)
        throw new NotFoundException('Ошибка поиска состояний заказов плат');

      states.map((item) => {
        data.push({
          ...item,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findOne(id: number): Promise<PcbOrderStates> {
    const entity = await this.repository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new NotFoundException(`Состояние заказа ПП с ID ${id} не найдено`);
    }
    return entity;
  }

  async update(
    id: number,
    data: Partial<PcbOrderStates>,
  ): Promise<PcbOrderStates> {
    try {
      const existing = await this.findOne(id);

      if (this.SYSTEM_STATES.includes(existing.state)) {
        throw new ForbiddenException('Системный статус заказа ПП нельзя изменять');
      }

      await this.repository.update(id, data);
      return await this.findOne(id);
    } catch (e) {
      console.error('Ошибка при изменении статуса заказа ПП!', e);
      throw e;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const existing = await this.findOne(id);

      if (this.SYSTEM_STATES.includes(existing.state)) {
        throw new ForbiddenException('Системный статус заказа ПП нельзя удалять');
      }

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
      console.error('Ошибка при удалении статуса заказа ПП!', e);
      throw e;
    }
  }
}
