import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { InventarizationService } from './inventarization.service';
import { Inventarization } from './inventarization.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InventarizationDTO } from './dto/InventarizationDTO';
import { InventarizationCalculationDTO, CreateInventarizationFromCalculationDTO } from 'src/features/inventarization-business/dto/inventarization-calculation.dto';

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

  @ApiOperation({ summary: 'Рассчитать количество компонента для инвентаризации' })
  @ApiResponse({ status: 200, description: 'Результат расчета получен' })
  @Get('calculate/:componentId')
  async calculateComponentCount(
    @Param('componentId') componentId: string,
    @Query('factoryId') factoryId: string,
    @Query('calculationDate') calculationDate?: string,
  ) {
    const date = calculationDate ? new Date(calculationDate) : undefined;
    const parsedFactoryId = factoryId ? parseInt(factoryId, 10) : null;

    if (!parsedFactoryId || isNaN(parsedFactoryId)) {
      throw new Error('factoryId является обязательным параметром и должен быть числом');
    }

    return await this.service.calculateComponentCount(
      +componentId,
      parsedFactoryId,
      date
    );
  }

  @ApiOperation({ summary: 'Массовый расчет количества компонентов' })
  @ApiResponse({ status: 200, description: 'Результаты расчетов получены' })
  @Post('calculate-multiple')
  async calculateMultipleComponents(@Body() data: InventarizationCalculationDTO) {
    return await this.service.calculateMultipleComponents(data);
  }

  @ApiOperation({ summary: 'Создать инвентаризацию на основе автоматического расчета' })
  @ApiResponse({ status: 201, description: 'Инвентаризация создана' })
  @Post('create-from-calculation')
  async createInventarizationFromCalculation(@Body() data: CreateInventarizationFromCalculationDTO) {
    return await this.service.createInventarizationFromCalculation(data);
  }

  @ApiOperation({ summary: 'Обновить количество компонента на основе расчета' })
  @ApiResponse({ status: 200, description: 'Количество компонента обновлено' })
  @Patch('update-quantity/:componentId')
  async updateComponentQuantity(
    @Param('componentId') componentId: string,
    @Query('factoryId') factoryId: string,
    @Query('calculationDate') calculationDate?: string,
  ) {
    const date = calculationDate ? new Date(calculationDate) : undefined;
    const parsedFactoryId = factoryId ? parseInt(factoryId, 10) : null;

    if (!parsedFactoryId || isNaN(parsedFactoryId)) {
      throw new Error('factoryId является обязательным параметром и должен быть числом');
    }

    return await this.service.updateComponentQuantity(
      +componentId,
      parsedFactoryId,
      date
    );
  }

  @ApiOperation({ summary: 'Массово обновить количество компонентов на основе расчета' })
  @ApiResponse({ status: 200, description: 'Количество компонентов обновлено' })
  @Patch('update-multiple-quantity')
  async updateMultipleComponentsQuantity(@Body() data: InventarizationCalculationDTO) {
    return await this.service.updateMultipleComponentsQuantity(data);
  }

  @ApiOperation({ summary: 'Пересчитать количество всех компонентов для фабрики' })
  @ApiResponse({ status: 200, description: 'Количество всех компонентов обновлено' })
  @Patch('recalculate-all/:factoryId')
  async recalculateAllComponentsForFactory(
    @Param('factoryId') factoryId: string,
    @Query('calculationDate') calculationDate?: string,
  ) {
    const date = calculationDate ? new Date(calculationDate) : undefined;
    const parsedFactoryId = factoryId ? parseInt(factoryId, 10) : null;

    if (!parsedFactoryId || isNaN(parsedFactoryId)) {
      throw new Error('factoryId должен быть числом');
    }

    return await this.service.recalculateAllComponentsForFactory(
      parsedFactoryId,
      date
    );
  }
}
