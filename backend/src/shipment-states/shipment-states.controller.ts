import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { ShipmentStatesService } from './shipment-states.service';
import { ShipmentStatesDTO } from './dto/shipment-statesDTO';

@Controller('shipment-states')
export class ShipmentStatesController {
    constructor(private readonly shipmentStatesService: ShipmentStatesService) {}
            
    @Post('create')
        async create(@Body() createShipmentPackage: ShipmentStatesDTO) {
            return this.shipmentStatesService.create(createShipmentPackage);
    }
    
    @Delete('delete/:id')
        async remove(@Param('id') id) {
            return this.shipmentStatesService.remove(id);
    }
            
    @Get('get')
        async find() {
            return this.shipmentStatesService.find();
    }
}
