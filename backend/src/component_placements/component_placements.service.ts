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

  async findAll() {
    return await this.repo.find({ relations: ['placementType'] });
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['placementType'],
    });
  }

  async create(data: Partial<ComponentPlacements>) {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async update(id: number, data: Partial<ComponentPlacements>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
