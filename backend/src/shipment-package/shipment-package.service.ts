import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentPackage } from './shipment-package.entity';
import { ShipmentPackageDTO } from './dto/shipmentPackageDTO';

@Injectable()
export class ShipmentPackageService {
  constructor(
    @InjectRepository(ShipmentPackage)
    private shipmentsPackageRepository: Repository<ShipmentPackage>,
  ) {}
        
  async create(shipmentPackage: ShipmentPackageDTO) {
    try {
      const newShipmentPackage = this.shipmentsPackageRepository.create(shipmentPackage);
      return this.shipmentsPackageRepository.save(newShipmentPackage);
    } catch (e) {
      console.error(e);
      }
  }

  async update(id, shipmentPackage: ShipmentPackageDTO) {
    try {
      await this.shipmentsPackageRepository.update(id, shipmentPackage);
    } catch (e) {
      console.error(e);
      }
  }
        
  async remove(id) {
    try {
      await this.shipmentsPackageRepository.delete(id);
    } catch (e) {
        console.error(e);
        }
  }
        
  async find() {
    return this.shipmentsPackageRepository.find();
  }
}
