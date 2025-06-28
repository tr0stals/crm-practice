import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentPackage } from './shipment-package.entity';
import { ShipmentPackageDTO } from './dto/shipmentPackageDTO';

@Injectable()
export class ShipmentPackageService {
  constructor(
    @InjectRepository(ShipmentPackage)
    private repository: Repository<ShipmentPackage>,
  ) {}
        
  async create(data: ShipmentPackageDTO): Promise<ShipmentPackage> {
    try {
      const entity = this.repository.create(data);
      return await this.repository.save(entity);
    } catch (e) {
      console.error("Ошибка при создании записи", e);
      throw e;
    }
  }

  async update(id: number, data: ShipmentPackageDTO): Promise<ShipmentPackage> {
    try {
      await this.findOne(id);
      await this.repository.update(id, data);
      return await this.findOne(id);
    } catch (e) {
      console.error("ошибка при обновлении записи", e);
      throw e;
    }
  }
        
  async remove(id: number): Promise<void> {
    try {
      await this.findOne(id);
      await this.repository.delete(id);
    } catch (e) {
      console.error("ошибка при удалении записи", e);
      throw e;
    }
  }
        
  async findOne(id: number): Promise<ShipmentPackage> {
    const entity= await this.repository.findOne({
      where: {id},
      relations: ['shipmentPackageStates', 'shipments']});
            
    if(!entity)
    throw new NotFoundException(`Ящик отправок с ${id} не найден`);
    
    return entity;
  }

  async findAll(): Promise<ShipmentPackage[]> {
    try{
      return await this.repository.find({
      relations: ['shipmentPackageStates', 'shipments']});
    }
    catch(e){
      console.error("Ящики отправок не найдены", e);
      throw e;
    }
  }
}