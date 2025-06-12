import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandAssemblies } from './stand-assemblies.entity';

@Injectable()
export class StandAssembliesService {
  constructor(
    @InjectRepository(StandAssemblies)
    private readonly repo: Repository<StandAssemblies>,
  ) {}

  create(data: Partial<StandAssemblies>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['stands', 'shipments'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['stands', 'shipments'] });
  }

  update(id: number, data: Partial<StandAssemblies>) {
    return this.repo.update(id, data);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
