import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { PcbWarehouseComponentsService } from './pcb-warehouse-components.service';
import { PcbWarehouseComponents } from './pcb-warehouse-components.entity';

@Controller('pcb-warehouse-components')
export class PcbWarehouseComponentsController {
  constructor(private readonly service: PcbWarehouseComponentsService) {}

  @Post('create')
  async create(@Body() data: Partial<PcbWarehouseComponents>) {
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
  async update(@Param('id') id: string, @Body() data: Partial<PcbWarehouseComponents>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
