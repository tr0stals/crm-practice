import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShipmentTrips } from './shipment-trips.entity';
import { Repository } from 'typeorm';
import { ShipmentTripsDTO } from './dto/shipment-tripsDTO';

@Injectable()
export class ShipmentTripsService {
    constructor(
            @InjectRepository(ShipmentTrips)
            private shipmentTripsRepository: Repository<ShipmentTrips>,
          ) {}
        
          async create(shipmentTrips: ShipmentTripsDTO) {
            try {
              const newshipmentTrips = this.shipmentTripsRepository.create(shipmentTrips);
              return this.shipmentTripsRepository.save(newshipmentTrips);
            } catch (e) {
              console.error(e);
            }
          }
        
          async update(id, shipmentTrips: ShipmentTripsDTO) {
            try {
              await this.shipmentTripsRepository.update(id, shipmentTrips);
            } catch (e) {
              console.error(e);
            }
          }
        
          async remove(id) {
            try {
              await this.shipmentTripsRepository.delete(id);
            } catch (e) {
              console.error(e);
            }
          }
        
          async find() {
            return this.shipmentTripsRepository.find();
          }
}
