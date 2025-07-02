import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandPackages } from './stand-packages.entity';

@Injectable()
export class StandPackagesService {
  constructor(
    @InjectRepository(StandPackages)
    private readonly repo: Repository<StandPackages>,
  ) {}

  async create(data: Partial<StandPackages>) {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async findAll() {
    return await this.repo.find({ relations: ['stands'] });
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id }, relations: ['stands'] });
  }

  async generateData() {
    try {
      const packages = await this.findAll();
      const data: any[] = [];

      if (!packages)
        throw new NotFoundException('Ошибка поиска ящиков стендов');

      packages.map((item) => {
        const { stands, ...defaultData } = item;
        const standTitle = stands.title;

        data.push({
          ...defaultData,
          standTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: Partial<StandPackages>) {
    return await this.repo.update(id, data);
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
