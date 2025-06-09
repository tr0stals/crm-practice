import { Body, Controller, Patch, Post, Param, Delete, Get } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ShipmentsDTO } from './dto/shipmentsDTO';

@Controller('shipments')
export class ShipmentsController {
    constructor(private readonly shipmentService: ShipmentsService) {}
    
      @Post('create')
      async create(@Body() createshipment: ShipmentsDTO) {
        return this.shipmentService.create(createshipment);
      }
    
      @Patch('update/:id')
      async update(@Param('id') id, @Body() updateshipment: ShipmentsDTO) {
        return this.shipmentService.update(id, updateshipment);
      }
    
      @Delete('delete/:id')
      async remove(@Param('id') id) {
        return this.shipmentService.remove(id);
      }
    
      @Get('get')
      async find() {
        return this.shipmentService.find();
      }
}
