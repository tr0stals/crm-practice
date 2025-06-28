import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderRequestComponentsService } from './order-request-components.service';
import { OrderRequestComponents } from './order-request-components.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Связь запросов и комплектующих')
@Controller('order-request-components')
export class OrderRequestComponentsController {
  constructor(private readonly service: OrderRequestComponentsService) {}

  @ApiOperation({ summary: 'Создать связь' })
  @ApiResponse({ status: 201, description: 'Связь создана' })
  @Post('create')
  async create(@Body() data: Partial<OrderRequestComponents>) {
    return await this.service.create(data);
  }

  @ApiOperation({ summary: 'Получить все связи' })
  @ApiResponse({ status: 200, description: 'Список связей' })
  @Get('get')
  async getAll() {
    return await this.service.findAll();
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
  async update(@Param('id') id: string, @Body() data: Partial<OrderRequestComponents>) {
    return await this.service.update(+id, data);
  }

  @ApiOperation({ summary: 'Удалить связь' })
  @ApiResponse({ status: 200, description: 'Связь удалена' })
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
} 