import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerWriteoff } from './server-writeoff.entity';

@Injectable()
export class ServerWriteoffService {
  constructor(
    @InjectRepository(ServerWriteoff)
    private readonly repo: Repository<ServerWriteoff>,
  ) {}

  async getAll() {
    return this.repo.find({ relations: ['factory', 'components'] });
  }

  async getOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['factory', 'components'] });
  }

  async create(data: Partial<ServerWriteoff>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<ServerWriteoff>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
