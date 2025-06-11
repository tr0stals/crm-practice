import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShipmentPackageStates } from './shipment-package-states.entity';
import { Repository } from 'typeorm';
import { ShipmentPackageStatesDTO } from './dto/shipment-package-statesDTO';

@Injectable()
export class ShipmentPackageStatesService {
    constructor(
        @InjectRepository(ShipmentPackageStates)
        private shipmentPackageStatesRepository: Repository<ShipmentPackageStates>,
        ) {}
                
        async create(shipmentPackageState: ShipmentPackageStatesDTO) {
        try {
            const newShipmentPackageState = this.shipmentPackageStatesRepository.create(shipmentPackageState);
            return this.shipmentPackageStatesRepository.save(newShipmentPackageState);
        } catch (e) {
            console.error(e);
            }
        }
    
        async remove(id) {
        try {
            await this.shipmentPackageStatesRepository.delete(id);
        } catch (e) {
            console.error(e);
            }
        }
    
        async find() {
        return this.shipmentPackageStatesRepository.find();
      }
}
