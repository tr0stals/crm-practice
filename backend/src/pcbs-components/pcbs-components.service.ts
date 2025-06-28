import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PcbsComponents } from './pcbs-components.entity';

@Injectable()
export class PcbsComponentsService {
  constructor(
    @InjectRepository(PcbsComponents)
    private readonly repo: Repository<PcbsComponents>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['pcb', 'component'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['pcb', 'component'] });
  }

  create(data: Partial<PcbsComponents>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<PcbsComponents>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
} 