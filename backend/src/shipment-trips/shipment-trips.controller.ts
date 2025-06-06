import { Controller, Post, Body, Patch, Param, Delete, Get } from '@nestjs/common';
import { ShipmentTripsDTO } from './dto/shipment-tripsDTO';
import { ShipmentTripsService } from './shipment-trips.service';

@Controller('shipment-trips')
export class ShipmentTripsController {
    constructor(private readonly shipmentTripsService: ShipmentTripsService) {}
        
          @Post('create')
          async create(@Body() createshipmentTrips: ShipmentTripsDTO) {
            return this.shipmentTripsService.create(createshipmentTrips);
          }
        
          @Patch('update/:id')
          async update(@Param('id') id, @Body() updateshipmentTrips: ShipmentTripsDTO) {
            return this.shipmentTripsService.update(id, updateshipmentTrips);
          }
        
          @Delete('delete/:id')
          async remove(@Param('id') id) {
            return this.shipmentTripsService.remove(id);
          }
        
          @Get('get')
          async find() {
            return this.shipmentTripsService.find();
          }
}
