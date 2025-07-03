import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PcbOrderStates } from './pcb_order_states.entity';

@Injectable()
export class PcbOrderStatesService {
  constructor(
    @InjectRepository(PcbOrderStates)
    private repository: Repository<PcbOrderStates>,
  ) {}

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
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
