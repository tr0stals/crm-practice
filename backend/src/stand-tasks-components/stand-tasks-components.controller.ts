import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StandTasksComponentsService } from './stand-tasks-components.service';
import { StandTasksComponents } from './stand-tasks-components.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Комплектующие для задач стенда')
@Controller('stand-tasks-components')
export class StandTasksComponentsController {
  constructor(private readonly service: StandTasksComponentsService) {}

  @ApiOperation({ summary: 'Создать запись' })
  @ApiResponse({ status: 201, description: 'Запись создана' })
  @Post('create')
  async create(@Body() data: Partial<StandTasksComponents>) {
    return await this.service.create(data);
  }

  @ApiOperation({ summary: 'Получить все записи' })
  @ApiResponse({ status: 200, description: 'Список записей' })
  @Get('get')
  async getAll() {
    return await this.service.findAll();
  }

  @ApiOperation({ summary: 'Получить запись по ID' })
  @ApiResponse({ status: 200, description: 'Запись найдена' })
  @ApiResponse({ status: 404, description: 'Запись не найдена' })
  @Get('get/:id')
  async getOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }

  @ApiOperation({ summary: 'Обновить запись' })
  @ApiResponse({ status: 200, description: 'Запись обновлена' })
  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<StandTasksComponents>) {
    return await this.service.update(+id, data);
  }

  @ApiOperation({ summary: 'Удалить запись' })
  @ApiResponse({ status: 200, description: 'Запись удалена' })
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
} 