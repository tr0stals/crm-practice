import { Controller, Param, Post, Body, Delete, Get } from '@nestjs/common';
import { ShipmentPackageStatesService } from './shipment-package-states.service';
import { ShipmentPackageStatesDTO } from './dto/shipment-package-statesDTO';

@Controller('shipment-package-states')
export class ShipmentPackageStatesController {
    constructor(private readonly shipmentPackageStatesService: ShipmentPackageStatesService) {}
                
        @Post('create')
            async create(@Body() createShipmentPackageStates: ShipmentPackageStatesDTO) {
                return this.shipmentPackageStatesService.create(createShipmentPackageStates);
        }
        
        @Delete('delete/:id')
            async remove(@Param('id') id) {
                return this.shipmentPackageStatesService.remove(id);
        }
                
        @Get('get')
            async find() {
                return this.shipmentPackageStatesService.find();
        }
}
