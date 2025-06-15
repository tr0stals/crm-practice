import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Locations } from './locations.entity';

@Controller('locations')
export class LocationsController {
  constructor(private readonly service: LocationsService) {}

  @Post('create')
  async create(@Body() data: Partial<Locations>) {
    return await this.service.create(data);
  }

  @Get('get')
  async findAll() {
    return await this.service.findAll();
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<Locations>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
