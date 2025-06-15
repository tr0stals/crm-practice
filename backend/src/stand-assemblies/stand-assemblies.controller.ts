import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { StandAssembliesService } from './stand-assemblies.service';
import { StandAssemblies } from './stand-assemblies.entity';

@Controller('stand-assemblies')
export class StandAssembliesController {
  constructor(private readonly service: StandAssembliesService) {}

  @Post('create')
  async create(@Body() data: Partial<StandAssemblies>) {
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
  async update(@Param('id') id: string, @Body() data: Partial<StandAssemblies>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
