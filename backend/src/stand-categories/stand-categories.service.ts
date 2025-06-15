import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandCategories } from './stand-categories.entity';

@Injectable()
export class StandCategoriesService {
  constructor(
    @InjectRepository(StandCategories)
    private repository: Repository<StandCategories>,
  ) {}

  async create(data: Partial<StandCategories>): Promise<StandCategories> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<StandCategories[]> {
    return await this.repository.find({
      relations: ['stands']
    });
  }

  async findOne(id: number): Promise<StandCategories> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['stands']
    });
    if (!entity) {
      throw new NotFoundException(`Категория стенда с ID ${id} не найдена`);
    }
    return entity;
  }

  async update(id: number, data: Partial<StandCategories>): Promise<StandCategories> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
