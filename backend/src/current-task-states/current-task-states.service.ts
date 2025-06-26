import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentTaskStates } from './current-task-states.entity';

@Injectable()
export class CurrentTaskStatesService {
  constructor(
    @InjectRepository(CurrentTaskStates)
    private repo: Repository<CurrentTaskStates>,
  ) {}

  async create(data: Partial<CurrentTaskStates>) {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async getAll() {
    return await this.repo.find();
  }

  async getOne(id: number) {
    return await this.repo.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<CurrentTaskStates>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return await this.repo.delete(id);
  }
}
