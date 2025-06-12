import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stands } from './stands.entity';

@Injectable()
export class StandsService {
  constructor(
    @InjectRepository(Stands)
    private readonly repo: Repository<Stands>,
  ) {}

  create(data: Partial<Stands>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['standTypes', 'employees', 'standAssemblies', 'standPackages', 'orderRequests', 'pcbs'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['standTypes', 'employees', 'standAssemblies', 'standPackages', 'orderRequests', 'pcbs'] });
  }

  update(id: number, data: Partial<Stands>) {
    return this.repo.update(id, data);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
