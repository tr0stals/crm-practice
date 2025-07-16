import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderRequestsComponentsService } from './order_requests_components.service';
import { OrderRequestsComponents } from './order_requests_components.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderRequestsComponentsDTO } from './dto/OrderRequestsComponentsDTO';

@ApiTags('Связь запросов на закупку с комплектующими')
@Controller('order_requests_components')
export class OrderRequestsComponentsController {
  constructor(private readonly service: OrderRequestsComponentsService) {}

  @ApiOperation({ summary: 'Создать связь' })
  @ApiResponse({ status: 201, description: 'Связь создана' })
  @Post('create')
  async create(@Body() data: OrderRequestsComponentsDTO) {
    return await this.service.create(data);
  }

  @ApiOperation({ summary: 'Получить все связи' })
  @ApiResponse({ status: 200, description: 'Список связей' })
  @Get('get')
  async getAll() {
    return await this.service.findAll();
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @ApiOperation({ summary: 'Получить связь по ID' })
  @ApiResponse({ status: 200, description: 'Связь найдена' })
  @ApiResponse({ status: 404, description: 'Связь не найдена' })
  @Get('get/:id')
  async getOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }

  @ApiOperation({ summary: 'Обновить связь' })
  @ApiResponse({ status: 200, description: 'Связь обновлена' })
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<OrderRequestsComponents>,
  ) {
    return await this.service.update(+id, data);
  }

  @ApiOperation({ summary: 'Удалить связь' })
  @ApiResponse({ status: 200, description: 'Связь удалена' })
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
