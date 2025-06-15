import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { InvoicesArrivalService } from './Invoices_arrival.service';
import { InvoicesArrival } from './Invoices_arrival.entity';

@Controller('invoices-arrival')
export class InvoicesArrivalController {
  constructor(private readonly service: InvoicesArrivalService) {}

  @Post('create')
  async create(@Body() data: Partial<InvoicesArrival>) {
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
  async update(@Param('id') id: string, @Body() data: Partial<InvoicesArrival>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}