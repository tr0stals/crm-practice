import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { OrderRequestComponentsService } from './order-request-components.service';
import { OrderRequestComponents } from './order-request-components.entity';

@Controller('order-request-components')
export class OrderRequestComponentsController {
  constructor(private readonly service: OrderRequestComponentsService) {}

  @Post('create')
  async create(@Body() data: Partial<OrderRequestComponents>) {
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
  async update(@Param('id') id: string, @Body() data: Partial<OrderRequestComponents>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
