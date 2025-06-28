import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComponentPlacements } from './component_placements.entity';

@Injectable()
export class ComponentPlacementsService {
  constructor(
    @InjectRepository(ComponentPlacements)
    private readonly repo: Repository<ComponentPlacements>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['placementType'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['placementType'] });
  }

  create(data: Partial<ComponentPlacements>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<ComponentPlacements>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
} 