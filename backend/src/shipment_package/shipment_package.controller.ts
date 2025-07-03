import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { ShipmentPackageService } from './shipment_package.service';
import { ShipmentPackageDTO } from './dto/shipmentPackageDTO';

@Controller('shipment_package')
export class ShipmentPackageController {
  constructor(private readonly service: ShipmentPackageService) {}

  @Post('create')
  async create(@Body() data: ShipmentPackageDTO) {
    return await this.service.create(data);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: ShipmentPackageDTO) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }

  @Get('get')
  async findAll() {
    return await this.service.findAll();
  }
}
