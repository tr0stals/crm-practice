import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Suppliers } from './suppliers.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Suppliers)
    private repository: Repository<Suppliers>,
  ) {}

  async create(data: Partial<Suppliers>): Promise<Suppliers> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<Suppliers[]> {
    return await this.repository.find({
      relations: ['components']
    });
  }

  async findOne(id: number): Promise<Suppliers> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['components']
    });
    if (!entity) {
      throw new NotFoundException(`Поставщик с ID ${id} не найден`);
    }
    return entity;
  }

  async update(id: number, data: Partial<Suppliers>): Promise<Suppliers> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
