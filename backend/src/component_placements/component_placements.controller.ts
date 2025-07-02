import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ComponentPlacementsService } from './component_placements.service';
import { ComponentPlacements } from './component_placements.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Размещения компонентов')
@Controller('component-placements')
export class ComponentPlacementsController {
  constructor(private readonly service: ComponentPlacementsService) {}

  @ApiOperation({ summary: 'Создать размещение' })
  @ApiResponse({ status: 201, description: 'Размещение создано' })
  @Post('create')
  async create(@Body() data: Partial<ComponentPlacements>) {
    return await this.service.create(data);
  }

  @ApiOperation({ summary: 'Получить все размещения' })
  @ApiResponse({ status: 200, description: 'Список размещений' })
  @Get('get')
  async getAll() {
    return await this.service.findAll();
  }

  @ApiOperation({ summary: 'Получить размещение по ID' })
  @ApiResponse({ status: 200, description: 'Размещение найдено' })
  @ApiResponse({ status: 404, description: 'Размещение не найдено' })
  @Get('get/:id')
  async getOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @ApiOperation({ summary: 'Обновить размещение' })
  @ApiResponse({ status: 200, description: 'Размещение обновлено' })
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<ComponentPlacements>,
  ) {
    return await this.service.update(+id, data);
  }

  @ApiOperation({ summary: 'Удалить размещение' })
  @ApiResponse({ status: 200, description: 'Размещение удалено' })
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
