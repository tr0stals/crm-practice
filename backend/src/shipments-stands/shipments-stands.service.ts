import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentsStands } from './shipments-stands.entity';

@Injectable()
export class ShipmentsStandsService {
  constructor(
    @InjectRepository(ShipmentsStands)
    private repo: Repository<ShipmentsStands>,
  ) {}

  async create(data: Partial<ShipmentsStands>) {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async getAll() {
    return await this.repo.find();
  }

  async getOne(id: number) {
    return await this.repo.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<ShipmentsStands>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return await this.repo.delete(id);
  }
}
