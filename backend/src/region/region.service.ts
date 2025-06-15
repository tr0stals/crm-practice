import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './region.entity';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private repository: Repository<Region>,
  ) {}

  async create(data: Partial<Region>): Promise<Region> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<Region[]> {
    return await this.repository.find({
      relations: ['locations']
    });
  }

  async findOne(id: number): Promise<Region> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['locations']
    });
    if (!entity) {
      throw new NotFoundException(`Регион с ID ${id} не найден`);
    }
    return entity;
  }

  async update(id: number, data: Partial<Region>): Promise<Region> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
