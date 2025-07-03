import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PcbsComponents } from './pcbs_components.entity';

@Injectable()
export class PcbsComponentsService {
  constructor(
    @InjectRepository(PcbsComponents)
    private readonly repo: Repository<PcbsComponents>,
  ) {}

  async findAll() {
    return await this.repo.find({ relations: ['pcb', 'component'] });
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['pcb', 'component'],
    });
  }

  async generateData() {
    try {
      const pcbsComponents = await this.findAll();
      const data: any[] = [];

      if (!pcbsComponents)
        throw new NotFoundException('Ошибка при поиске компноентов плат');

      pcbsComponents.map((item) => {
        const { pcb, component, ...defaultData } = item;

        const pcbTitle = pcb.id;
        const componentTitle = component.title;

        data.push({
          ...defaultData,
          pcbTitle,
          componentTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async create(data: Partial<PcbsComponents>) {
    const entity = this.repo.create(data);
    return await this.repo.save(entity);
  }

  async update(id: number, data: Partial<PcbsComponents>) {
    await this.repo.update(id, data);
    return await this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
