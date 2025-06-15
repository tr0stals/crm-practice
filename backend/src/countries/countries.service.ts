import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Countries } from './countries.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Countries)
    private readonly repository: Repository<Countries>,
  ) {}

  async create(data: Partial<Countries>): Promise<Countries> {
    const country = this.repository.create(data);
    return await this.repository.save(country);
  }

  async findAll(): Promise<Countries[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<Countries> {
    const country = await this.repository.findOne({ where: { id } });
    if (!country) {
      throw new NotFoundException(`Страна с ID ${id} не найдена`);
    }
    return country;
  }

  async update(id: number, data: Partial<Countries>): Promise<Countries> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
