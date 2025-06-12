import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandsTypes } from './stand-types.entity';

@Injectable()
export class StandTypesService {
  constructor(
    @InjectRepository(StandsTypes)
    private readonly repo: Repository<StandsTypes>,
  ) {}

  create(data: Partial<StandsTypes>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['stands'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['stands'] });
  }

  update(id: number, data: Partial<StandsTypes>) {
    return this.repo.update(id, data);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
