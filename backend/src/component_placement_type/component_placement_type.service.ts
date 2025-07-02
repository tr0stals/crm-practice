import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComponentPlacementType } from './component_placement_type.entity';

@Injectable()
export class ComponentPlacementTypeService {
  constructor(
    @InjectRepository(ComponentPlacementType)
    private readonly repo: Repository<ComponentPlacementType>,
  ) {}

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id } });
  }

  async generateData() {
    try {
      const types = await this.findAll();
      const data: any[] = [];

      if (!types) throw new NotFoundException('Ошибка поиска типов размещений');

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

  async create(data: Partial<ComponentPlacementType>) {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async update(id: number, data: Partial<ComponentPlacementType>) {
    await this.repo.update(id, data);
    return await this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
