import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsDTO } from './dto/OrganizationsDTO';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @ApiOperation({ summary: 'Создание организации' })
  @ApiResponse({ status: 200, description: 'Организация создана успешно' })
  @Post('create')
  async create(@Body() createOrganization: OrganizationsDTO) {
    return await this.organizationsService.create(createOrganization);
  }

  @ApiOperation({ summary: 'Получение всех организаций' })
  @ApiResponse({ status: 200, description: 'Организации получены успешно' })
  @Get('get')
  async get() {
    return await this.organizationsService.get();
  }

  @Get('get/:id')
  async getById(@Param('id') id: number) {
    return await this.organizationsService.getById(id);
  }

  @ApiOperation({ summary: 'Получение дерева организаций' })
  @ApiResponse({
    status: 200,
    description: 'Дерево организаций получено успешно',
  })
  @Get('tree')
  async getOrganizationsTree() {
    return await this.organizationsService.getOrganizationsTree();
  }

  @ApiOperation({ summary: 'Обновление организации' })
  @ApiResponse({ status: 200, description: 'Организация обновлена успешно' })
  @Patch('update/:id')
  async update(@Param('id') id: number, data: OrganizationsDTO) {
    return await this.organizationsService.update(id, data);
  }

  @ApiOperation({ summary: 'Удаление организации' })
  @ApiResponse({ status: 200, description: 'Организация удалена успешно' })
  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return await this.organizationsService.remove(id);
  }
}
