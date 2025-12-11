import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ComponentPlacementTypeService } from './component_placement_type.service';
import { ComponentPlacementType } from './component_placement_type.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ComponentPlacementTypeDTO } from './dto/ComponentPlacementTypeDTO';

@ApiTags('Типы размещения компонентов')
@Controller('component_placement_types')
export class ComponentPlacementTypeController {
  constructor(private readonly service: ComponentPlacementTypeService) {}

  @ApiOperation({ summary: 'Создать тип размещения' })
  @ApiResponse({ status: 201, description: 'Тип размещения создан' })
  @Post('create')
  async create(@Body() data: ComponentPlacementTypeDTO) {
    return await this.service.create(data);
  }

  @ApiOperation({ summary: 'Получить все типы размещения' })
  @ApiResponse({ status: 200, description: 'Список типов размещения' })
  @Get('get')
  async getAll() {
    return await this.service.findAll();
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @ApiOperation({ summary: 'Получить тип размещения по ID' })
  @ApiResponse({ status: 200, description: 'Тип размещения найден' })
  @ApiResponse({ status: 404, description: 'Тип размещения не найден' })
  @Get('get/:id')
  async getOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }

  @Get('byComponentPlacementType/:id')
  async getByComponentPlacementType(@Param('id') id: string) {
    return await this.service.getByComponentPlacementType(+id);
  }

  @ApiOperation({ summary: 'Обновить тип размещения' })
  @ApiResponse({ status: 200, description: 'Тип размещения обновлен' })
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() data: ComponentPlacementTypeDTO,
  ) {
    return await this.service.update(+id, data);
  }

  @ApiOperation({ summary: 'Удалить тип размещения' })
  @ApiResponse({ status: 200, description: 'Тип размещения удален' })
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
