import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { StandAssembliesService } from './stand-assemblies.service';
import { StandAssemblies } from './stand-assemblies.entity';

@Controller('stand-assemblies')
export class StandAssembliesController {
  constructor(private readonly service: StandAssembliesService) {}

  @Post()
  create(@Body() data: Partial<StandAssemblies>) {
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
  update(@Param('id') id: string, @Body() data: Partial<StandAssemblies>) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
