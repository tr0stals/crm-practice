import { Injectable, NotFoundException } from '@nestjs/common';
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
    return await this.repo.find({
      relations: ['shipments', 'stands'],
    });
  }

  async generateData() {
    try {
      const shipmentStands = await this.getAll();
      const data: any[] = [];

      if (!shipmentStands)
        throw new NotFoundException('Ошибка поиска ShipmentsStands');

      shipmentStands.map((item) => {
        const { shipments, stands, ...defaultData } = item;
        const shipmentDate = shipments.shipmentDate;
        const standTitle = stands.title;

        data.push({
          ...defaultData,
          shipmentDate,
          standTitle,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['shipments', 'stands'],
    });
  }

  async update(id: number, data: Partial<ShipmentsStands>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return await this.repo.delete(id);
  }
}
