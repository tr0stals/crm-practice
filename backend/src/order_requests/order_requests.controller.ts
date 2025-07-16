import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { OrderRequestsService } from './order_requests.service';
import { OrderRequests } from './order_requests.entity';
import { OrderRequestsDTO } from './dto/OrderRequestsDTO';

@Controller('order_requests')
export class OrderRequestsController {
  constructor(private readonly service: OrderRequestsService) {}

  @Post('create')
  async create(@Body() data: OrderRequestsDTO) {
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

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<OrderRequests>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
