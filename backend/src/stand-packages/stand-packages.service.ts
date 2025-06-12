import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandPackages } from './stand-packages.entity';

@Injectable()
export class StandPackagesService {
  constructor(
    @InjectRepository(StandPackages)
    private readonly repo: Repository<StandPackages>,
  ) {}

  create(data: Partial<StandPackages>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['stands'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['stands'] });
  }

  update(id: number, data: Partial<StandPackages>) {
    return this.repo.update(id, data);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
