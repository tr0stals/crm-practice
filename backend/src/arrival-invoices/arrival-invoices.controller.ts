import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ArrivalInvoicesService } from './arrival-invoices.service';
import { ArrivalInvoices } from './arrival-invoices.entity';

@Controller('arrival-invoices')
export class ArrivalInvoicesController {
  constructor(private readonly service: ArrivalInvoicesService) {}

  @Get('get')
  async getAll() {
    return this.service.getAll();
  }

  @Get('get/:id')
  async getOne(@Param('id') id: string) {
    return this.service.getOne(+id);
  }

  @Post('create')
  async create(@Body() data: Partial<ArrivalInvoices>) {
    return this.service.create(data);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<ArrivalInvoices>) {
    return this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
