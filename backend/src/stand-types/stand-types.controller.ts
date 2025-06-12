import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { StandTypesService } from './stand-types.service';
import { StandsTypes } from './stand-types.entity';

@Controller('stand-types')
export class StandTypesController {
  constructor(private readonly service: StandTypesService) {}

  @Post()
  create(@Body() data: Partial<StandsTypes>) {
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
  update(@Param('id') id: string, @Body() data: Partial<StandsTypes>) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
