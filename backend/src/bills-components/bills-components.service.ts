import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillsComponents } from './bills-components.entity';

@Injectable()
export class BillsComponentsService {
  constructor(
    @InjectRepository(BillsComponents)
    private readonly repo: Repository<BillsComponents>,
  ) {}

  async getAll() {
    return this.repo.find({ relations: ['bill', 'component'] });
  }

  async getOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['bill', 'component'] });
  }

  async create(data: Partial<BillsComponents>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<BillsComponents>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
} 