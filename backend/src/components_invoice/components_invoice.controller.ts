import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ComponentsInvoiceService } from './components_invoice.service';
import { ComponentsInvoice } from './components_invoice.entity';

@Controller('components-invoice')
export class ComponentsInvoiceController {
  constructor(private readonly service: ComponentsInvoiceService) {}

  @Post('create')
  async create(@Body() data: Partial<ComponentsInvoice>) {
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
  async update(@Param('id') id: string, @Body() data: Partial<ComponentsInvoice>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}