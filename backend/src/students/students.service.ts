import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Students } from './students.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Students)
    private repository: Repository<Students>,
  ) {}

  async create(data: Partial<Students>): Promise<Students> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<Students[]> {
    return await this.repository.find({
      relations: ['stand_courses']
    });
  }

  async findOne(id: number): Promise<Students> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['stand_courses']
    });
    if (!entity) {
      throw new NotFoundException(`Студент с ID ${id} не найден`);
    }
    return entity;
  }

  async update(id: number, data: Partial<Students>): Promise<Students> {
    await this.findOne(id); // Проверяем существование
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Проверяем существование
    await this.repository.delete(id);
  }
}
