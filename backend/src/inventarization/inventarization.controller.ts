import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InventarizationService } from './inventarization.service';
import { Inventarization } from './inventarization.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InventarizationDTO } from './dto/InventarizationDTO';

@ApiTags('Инвентаризация')
@Controller('inventarization')
export class InventarizationController {
  constructor(private readonly service: InventarizationService) {}

  @ApiOperation({ summary: 'Создать запись инвентаризации' })
  @ApiResponse({ status: 201, description: 'Запись создана' })
  @Post('create')
  async create(@Body() data: InventarizationDTO) {
    return await this.service.create(data);
  }

  @ApiOperation({ summary: 'Получить все записи инвентаризации' })
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

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @ApiOperation({ summary: 'Получить дерево инвентаризации' })
  @ApiResponse({ status: 200, description: 'Дерево инвентаризации получено' })
  @Get('tree')
  async getInventarizationTree() {
    return await this.service.getInventarizationTree();
  }

  @ApiOperation({ summary: 'Обновить запись инвентаризации' })
  @ApiResponse({ status: 200, description: 'Запись обновлена' })
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Inventarization>,
  ) {
    return await this.service.update(+id, data);
  }

  @ApiOperation({ summary: 'Удалить запись инвентаризации' })
  @ApiResponse({ status: 200, description: 'Запись удалена' })
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
