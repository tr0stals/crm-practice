import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professions } from './professions.entity';

@Injectable()
export class ProfessionsService {
  constructor(
    @InjectRepository(Professions)
    private professionsRepository: Repository<Professions>,
  ) {}

  async create(data: Professions) {
    const profession = this.professionsRepository.create(data);
    return await this.professionsRepository.save(profession);
  }

  async getAll() {
    return await this.professionsRepository.find();
  }

  async update(id: number, data: Professions) {
    await this.professionsRepository.update(id, data);
    return await this.professionsRepository.findOne({ where: { id } });
  }

  async delete(id: number) {
    return await this.professionsRepository.delete(id);
  }
}
