import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WriteoffReasons } from './writeoff-reasons.entity';

@Injectable()
export class WriteoffReasonsService {
  constructor(
    @InjectRepository(WriteoffReasons)
    private readonly repo: Repository<WriteoffReasons>,
  ) {}

  async getAll() {
    return this.repo.find({ relations: ['writeoffs'] });
  }

  async getOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['writeoffs'] });
  }

  async create(data: Partial<WriteoffReasons>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<WriteoffReasons>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
