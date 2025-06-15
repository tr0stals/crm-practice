import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PcbOrderStates } from './pcb-order-states.entity';

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
    return await this.repository.find({
      relations: ['pcbOrders']
    });
  }

  async findOne(id: number): Promise<PcbOrderStates> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['pcbOrders']
    });
    if (!entity) {
      throw new NotFoundException(`Состояние заказа ПП с ID ${id} не найдено`);
    }
    return entity;
  }

  async update(id: number, data: Partial<PcbOrderStates>): Promise<PcbOrderStates> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
