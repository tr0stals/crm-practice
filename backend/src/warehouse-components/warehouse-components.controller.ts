import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { WarehouseComponentsService } from './warehouse-components.service';
import { WarehouseComponents } from './warehouse-components.entity';

@Controller('warehouse-components')
export class WarehouseComponentsController {
  constructor(private readonly service: WarehouseComponentsService) {}

  @Post('create')
  async create(@Body() data: Partial<WarehouseComponents>): Promise<WarehouseComponents> {
    return await this.service.create(data);
  }

  @Get('get')
  async findAll(): Promise<WarehouseComponents[]> {
    return await this.service.findAll();
  }

  @Get('get/:id')
  async findOne(@Param('id') id: number): Promise<WarehouseComponents> {
    return await this.service.findOne(id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<WarehouseComponents>,
  ): Promise<WarehouseComponents> {
    return await this.service.update(id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.service.remove(id);
  }
}
