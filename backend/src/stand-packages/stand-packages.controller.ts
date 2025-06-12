import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { StandPackagesService } from './stand-packages.service';
import { StandPackages } from './stand-packages.entity';

@Controller('stand-packages')
export class StandPackagesController {
  constructor(private readonly service: StandPackagesService) {}

  @Post()
  create(@Body() data: Partial<StandPackages>) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<StandPackages>) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
