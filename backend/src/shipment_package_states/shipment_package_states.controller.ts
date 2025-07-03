import {
  Controller,
  Param,
  Post,
  Body,
  Delete,
  Get,
  Patch,
} from '@nestjs/common';
import { ShipmentPackageStatesService } from './shipment_package_states.service';
import { ShipmentPackageStatesDTO } from './dto/ShipmentPackageStatesDTO';

@Controller('shipment_package_states')
export class ShipmentPackageStatesController {
  constructor(private readonly service: ShipmentPackageStatesService) {}

  @Post('create')
  async create(@Body() data: ShipmentPackageStatesDTO) {
    return await this.service.create(data);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() data: ShipmentPackageStatesDTO,
  ) {
    return await this.service.update(+id, data);
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return this.service.remove(+id);
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
