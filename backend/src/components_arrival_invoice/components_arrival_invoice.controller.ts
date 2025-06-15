import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ComponentsArrivalInvoiceService } from './components_arrival_invoice.service';
import { ComponentsArrivalInvoice } from './components_arrival_invoice.entity';

@Controller('components-arrival-invoice')
export class ComponentsArrivalInvoiceController {
  constructor(private readonly service: ComponentsArrivalInvoiceService) {}

  @Post('create')
  async create(@Body() data: Partial<ComponentsArrivalInvoice>) {
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
  async update(@Param('id') id: string, @Body() data: Partial<ComponentsArrivalInvoice>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}