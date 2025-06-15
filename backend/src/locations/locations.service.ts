import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Locations } from './locations.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Locations)
    private repository: Repository<Locations>,
  ) {}

  async create(data: Partial<Locations>): Promise<Locations> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<Locations[]> {
    return await this.repository.find({
      relations: ['region']
    });
  }

  async findOne(id: number): Promise<Locations> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['region']
    });
    if (!entity) {
      throw new NotFoundException(`Локация с ID ${id} не найдена`);
    }
    return entity;
  }

  async update(id: number, data: Partial<Locations>): Promise<Locations> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
