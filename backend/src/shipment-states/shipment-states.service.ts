import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShipmentStates } from './shipment-states.entity';
import { Repository } from 'typeorm';
import { ShipmentStatesDTO } from './dto/shipment-statesDTO';

@Injectable()
export class ShipmentStatesService {
    constructor(
    @InjectRepository(ShipmentStates)
    private shipmentStatesRepository: Repository<ShipmentStates>,
    ) {}
            
    async create(shipmentState: ShipmentStatesDTO) {
    try {
        const newShipmentState = this.shipmentStatesRepository.create(shipmentState);
        return this.shipmentStatesRepository.save(newShipmentState);
    } catch (e) {
        console.error(e);
        }
    }

    async remove(id) {
    try {
        await this.shipmentStatesRepository.delete(id);
    } catch (e) {
        console.error(e);
        }
    }

    async find() {
    return this.shipmentStatesRepository.find();
  }
}
