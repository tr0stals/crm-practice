import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { SupplierComponentsService } from './supplier_components.service';
import { SupplierComponents } from './supplier_components.entity';

@Controller('supplier_components')
export class SupplierComponentsController {
  constructor(private readonly service: SupplierComponentsService) {}

  @Post('create')
  async create(@Body() data: Partial<SupplierComponents>) {
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
  async update(@Param('id') id: string, @Body() data: Partial<SupplierComponents>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
} 