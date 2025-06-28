import { Controller, Post, Body, Patch, Param, Delete, Get } from '@nestjs/common';
import { ShipmentTripsDTO } from './dto/shipment-tripsDTO';
import { ShipmentTripsService } from './shipment-trips.service';

@Controller('shipment-trips')
export class ShipmentTripsController {
    constructor(private readonly shipmentTripsService: ShipmentTripsService) {}
        
          @Post('create')
          async create(@Body() data: ShipmentTripsDTO) {
            return await this.shipmentTripsService.create(data);
          }
        
          @Patch('update/:id')
          async update(@Param('id') id:string, @Body() data: ShipmentTripsDTO) {
            return await this.shipmentTripsService.update(+id, data);
          }
        
          @Delete('delete/:id')
          async remove(@Param('id') id: string) {
            return await this.shipmentTripsService.remove(+id);
          }
        
          @Get('get/:id')
          async findOne(@Param('id') id: string) {
            return await this.shipmentTripsService.findOne(+id);
          }

          @Get('get')
          async findAll() {
            return await this.shipmentTripsService.findAll();
          }
}
