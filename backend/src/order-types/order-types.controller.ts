import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { OrderTypesService } from './order-types.service';
import { OrderTypes } from './order-types.entity';

@Controller('order-types')
export class OrderTypesController {
  constructor(private readonly service: OrderTypesService) {}

  @Post('create')
  async create(@Body() data: Partial<OrderTypes>) {
    return await this.service.create(data);
  }

  @Get('get')
  async findAll() {
    return await this.service.findAll();
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<OrderTypes>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
