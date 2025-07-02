import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShipmentPackageStates } from './shipment-package-states.entity';
import { Entity, Repository } from 'typeorm';
import { ShipmentPackageStatesDTO } from './dto/shipment-package-statesDTO';

@Injectable()
export class ShipmentPackageStatesService {
  constructor(
    @InjectRepository(ShipmentPackageStates)
    private repository: Repository<ShipmentPackageStates>,
  ) {}

  async create(data: ShipmentPackageStatesDTO): Promise<ShipmentPackageStates> {
    try {
      const entity = this.repository.create(data);
      return await this.repository.save(entity);
    } catch (e) {
      console.error('Ошибка при создании записи', e);
      throw e;
    }
  }

  async update(
    id: number,
    data: ShipmentPackageStatesDTO,
  ): Promise<ShipmentPackageStates> {
    try {
      await this.findOne(id);
      await this.repository.update(id, data);
      return await this.findOne(id);
    } catch (e) {
      console.error('Ошибка при обновлении записи', e);
      throw e;
    }
  }

  async generateData() {
    try {
      const states = await this.findAll();
      const data: any[] = [];

      if (!states)
        throw new NotFoundException('Ошибка при поиске состояний ящиков');

      states.map((item) => {
        data.push({
          ...item,
        });
      });

      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.findOne(id);
      await this.repository.delete(id);
    } catch (e) {
      console.error('ошибка при удалении записи', e);
      throw e;
    }
  }

  async findOne(id: number): Promise<ShipmentPackageStates> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity)
      throw new NotFoundException(`состояние поставки с ${id} не найдено`);

    return entity;
  }

  async findAll(): Promise<ShipmentPackageStates[]> {
    try {
      return await this.repository.find();
    } catch (e) {
      console.error('Состояния не найдены', e);
      throw e;
    }
  }
}
