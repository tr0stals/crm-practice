import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { StandsService } from './stands.service';
import { Stands } from './stands.entity';

@Controller('stands')
export class StandsController {
  constructor(private readonly service: StandsService) {}

  @Post()
  create(@Body() data: Partial<Stands>) {
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
  update(@Param('id') id: string, @Body() data: Partial<Stands>) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
