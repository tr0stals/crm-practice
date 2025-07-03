import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { ShipmentTripsDTO } from './dto/ShipmentTripsDTO';
import { ShipmentTripsService } from './shipment_trips.service';

@Controller('shipment_trips')
export class ShipmentTripsController {
  constructor(private readonly shipmentTripsService: ShipmentTripsService) {}

  @Post('create')
  async create(@Body() data: ShipmentTripsDTO) {
    return await this.shipmentTripsService.create(data);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: ShipmentTripsDTO) {
    return await this.shipmentTripsService.update(+id, data);
  }

  @Get('generateData')
  async generateData() {
    return await this.shipmentTripsService.generateData();
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
