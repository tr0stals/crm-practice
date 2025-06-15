import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandCourses } from './stand-courses.entity';

@Injectable()
export class StandCoursesService {
  constructor(
    @InjectRepository(StandCourses)
    private repository: Repository<StandCourses>,
  ) {}

  async create(data: Partial<StandCourses>): Promise<StandCourses> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<StandCourses[]> {
    return await this.repository.find({
      relations: ['stand']
    });
  }

  async findOne(id: number): Promise<StandCourses> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['stand']
    });
    if (!entity) {
      throw new NotFoundException(`Курс стенда с ID ${id} не найден`);
    }
    return entity;
  }

  async update(id: number, data: Partial<StandCourses>): Promise<StandCourses> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
