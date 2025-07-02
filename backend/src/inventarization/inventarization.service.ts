import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventarization } from './inventarization.entity';

@Injectable()
export class InventarizationService {
  constructor(
    @InjectRepository(Inventarization)
    private readonly repo: Repository<Inventarization>,
  ) {}

  async findAll() {
    return await this.repo.find({ relations: ['component', 'factory'] });
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['component', 'factory'],
    });
  }

  async generateData() {
    try {
      const inventarizations = await this.findAll();
      const data: any[] = [];

      if (!inventarizations)
        throw new NotFoundException('Ошибка при поиске инвентаризации');

      inventarizations.map((item) => {
        const { component, factory, ...defaultData } = item;
        const componentTitle = component.title;
        const factoryTitle = factory.shortName;

        data.push({
          ...defaultData,
          componentTitle,
          factoryTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: Partial<Inventarization>) {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async update(id: number, data: Partial<Inventarization>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
