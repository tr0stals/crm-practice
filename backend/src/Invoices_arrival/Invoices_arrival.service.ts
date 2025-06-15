import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoicesArrival } from './Invoices_arrival.entity';

@Injectable()
export class InvoicesArrivalService {
  constructor(
    @InjectRepository(InvoicesArrival)
    private repository: Repository<InvoicesArrival>,
  ) {}

  async create(data: Partial<InvoicesArrival>): Promise<InvoicesArrival> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<InvoicesArrival[]> {
    return await this.repository.find({
      relations: ['supplier', 'components']
    });
  }

  async findOne(id: number): Promise<InvoicesArrival> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['supplier', 'components']
    });
    if (!entity) {
      throw new NotFoundException(`Накладная прихода с ID ${id} не найдена`);
    }
    return entity;
  }

  async update(id: number, data: Partial<InvoicesArrival>): Promise<InvoicesArrival> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}