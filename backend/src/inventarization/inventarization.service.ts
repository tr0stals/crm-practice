import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventarization } from './inventarization.entity';

@Injectable()
export class InventarizationService {
  constructor(
    @InjectRepository(Inventarization)
    private readonly repo: Repository<Inventarization>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['component', 'factory'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['component', 'factory'] });
  }

  create(data: Partial<Inventarization>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Inventarization>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
} 