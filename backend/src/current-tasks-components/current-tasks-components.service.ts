import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentTasksComponents } from './current-tasks-components.entity';

@Injectable()
export class CurrentTasksComponentsService {
  constructor(
    @InjectRepository(CurrentTasksComponents)
    private readonly repo: Repository<CurrentTasksComponents>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['currentTask', 'component'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['currentTask', 'component'] });
  }

  create(data: Partial<CurrentTasksComponents>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<CurrentTasksComponents>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
} 