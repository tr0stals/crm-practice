import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendingBoxes } from './sending_boxes.entity';

@Injectable()
export class SendingBoxesService {
  constructor(
    @InjectRepository(SendingBoxes)
    private repository: Repository<SendingBoxes>,
  ) {}

  async create(data: Partial<SendingBoxes>): Promise<SendingBoxes> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<SendingBoxes[]> {
    return await this.repository.find({
      relations: ['stand']
    });
  }

  async findOne(id: number): Promise<SendingBoxes> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['stand']
    });
    if (!entity) {
      throw new NotFoundException(`Отправляемая коробка с ID ${id} не найдена`);
    }
    return entity;
  }

  async update(id: number, data: Partial<SendingBoxes>): Promise<SendingBoxes> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}