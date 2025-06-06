import { Controller, Post, Body, Patch, Param, Delete, Get } from '@nestjs/common';
import { ShipmentPackageService } from './shipment-package.service';
import { ShipmentPackageDTO } from './dto/shipmentPackageDTO';

@Controller('shipment-package')
export class ShipmentPackageController {
  constructor(private readonly shipmentPackageService: ShipmentPackageService) {}
        
  @Post('create')
    async create(@Body() createShipmentPackage: ShipmentPackageDTO) {
      return this.shipmentPackageService.create(createShipmentPackage);
    }
        
    @Patch('update/:id')
    async update(@Param('id') id, @Body() updateShipmentPackage: ShipmentPackageDTO) {
      return this.shipmentPackageService.update(id, updateShipmentPackage);
    }
        
    @Delete('delete/:id')
    async remove(@Param('id') id) {
      return this.shipmentPackageService.remove(id);
    }
        
    @Get('get')
    async find() {
      return this.shipmentPackageService.find();
    }
}
