import { Controller, Get } from '@nestjs/common';
import { ComponentsService } from '../components/components.service';

@Controller('warehouse-components')
export class WarehouseComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Get('get')
  async getAll() {
    return this.componentsService.findAll();
  }
} 