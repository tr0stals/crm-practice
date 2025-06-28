import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComponentPlacementType } from './component_placement_type.entity';

@Injectable()
export class ComponentPlacementTypeService {
  constructor(
    @InjectRepository(ComponentPlacementType)
    private readonly repo: Repository<ComponentPlacementType>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<ComponentPlacementType>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<ComponentPlacementType>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
} 