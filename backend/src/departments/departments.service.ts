import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departments } from './departments.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Departments)
    private readonly repo: Repository<Departments>,
  ) {}

  async create(data: Partial<Departments>) {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async findAll() {
    return await this.repo.find();
  }

  async generateData() {
    try {
      const departments = await this.findAll();
      const data: any[] = [];

      if (!departments)
        throw new NotFoundException('Ошибка при поиске отделов');

      departments.map((item) => {
        data.push({
          ...item,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: { id },
    });
  }

  async update(id: number, data: Partial<Departments>) {
    return await this.repo.update(id, data);
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
