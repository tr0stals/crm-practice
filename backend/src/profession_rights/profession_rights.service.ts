import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfessionRights } from './profession_rights.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfessionRightsService {
  constructor(
    @InjectRepository(ProfessionRights)
    private repo: Repository<ProfessionRights>,
  ) {}

  async getProfessions() {
    try {
      const data: any[] = [];
      const professionRights = await this.repo.find({
        relations: ['professions', 'rights'],
      });

      professionRights.map((item: any) => {
        console.log(item);
        data.push(item.professions);
      });

      return professionRights;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getAll() {
    try {
      return await this.repo.find({
        relations: ['professions', 'rights'],
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
