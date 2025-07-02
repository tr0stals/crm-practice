import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandsTypes } from './stand-types.entity';

@Injectable()
export class StandTypesService {
  constructor(
    @InjectRepository(StandsTypes)
    private readonly repository: Repository<StandsTypes>,
  ) {}

  create(data: Partial<StandsTypes>) {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  findAll() {
    return this.repository.find();
  }

  async generateData() {
    try {
      const types = await this.findAll();
      const data: any[] = [];

      if (!types)
        throw new NotFoundException('Ошибка при поиске типов стендов');

      types.map((item) => {
        data.push({
          ...item,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  update(id: number, data: Partial<StandsTypes>) {
    return this.repository.update(id, data);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
