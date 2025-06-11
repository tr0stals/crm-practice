import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shipments } from './shipments.entity';
import { Repository } from 'typeorm';
import { ShipmentsDTO } from './dto/shipmentsDTO';

@Injectable()
export class ShipmentsService {
    constructor(
        @InjectRepository(Shipments)
        private shipmentsRepository: Repository<Shipments>,
      ) {}
    
      async create(shipment: ShipmentsDTO) {
        try {
          const newShipment = this.shipmentsRepository.create(shipment);
          return this.shipmentsRepository.save(newShipment);
        } catch (e) {
          console.error(e);
        }
      }
    
      async update(id, shipment: ShipmentsDTO) {
        try {
          await this.shipmentsRepository.update(id, shipment);
        } catch (e) {
          console.error(e);
        }
      }
    
      async remove(id) {
        try {
          await this.shipmentsRepository.delete(id);
        } catch (e) {
          console.error(e);
        }
      }
    
      async find() {
        return this.shipmentsRepository.find();
      }
}
