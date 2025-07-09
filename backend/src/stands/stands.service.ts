import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stands } from './stands.entity';

@Injectable()
export class StandsService {
  constructor(
    @InjectRepository(Stands)
    private readonly repo: Repository<Stands>,
  ) {}

  async create(data: Partial<Stands>) {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async findAll() {
    return await this.repo.find({
      relations: ['standType', 'employees', 'employees.peoples'],
    });
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['standType', 'employees', 'employees.peoples'],
    });
  }

  async generateData() {
    try {
      const stands = await this.findAll();
      const data: any[] = [];

      if (!stands) throw new Error('Ошибка при поиске стендов!');

      stands.map((item) => {
        const { parentId, standType, employees, ...defaultData } = item;
        console.debug('employees!!!!!!', employees);
        const standTypeTitle = standType.title;

        if (!employees.peoples) throw new Error('Не найден сотрудник!');
        const employeeName = `${employees.peoples?.firstName} ${employees.peoples?.middleName} ${employees.peoples?.lastName}`;

        data.push({
          ...defaultData,
          standTypeTitle,
          employeeName,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<Stands>) {
    return await this.repo.update(id, data);
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
