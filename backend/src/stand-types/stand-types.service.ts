import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandsTypes } from './stand-types.entity';

@Injectable()
export class StandTypesService {
  constructor(
    @InjectRepository(StandsTypes)
    private readonly repository: Repository<StandsTypes>,
  ) {}

  create(data: Partial<StandsTypes>) {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  findAll() {
    return this.repository.find({ relations: ['stands'] });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['stands'] });
  }

  update(id: number, data: Partial<StandsTypes>) {
    return this.repository.update(id, data);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
