import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Writeoff } from './writeoff.entity';

@Injectable()
export class WriteoffService {
  constructor(
    @InjectRepository(Writeoff)
    private readonly repo: Repository<Writeoff>,
  ) {}

  async getAll() {
    return this.repo.find({ relations: ['writeoffReasons', 'components', 'factory'] });
  }

  async getOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['writeoffReasons', 'components', 'factory'] });
  }

  async create(data: Partial<Writeoff>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Writeoff>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
