import {
  Body,
  Controller,
  Patch,
  Post,
  Param,
  Delete,
  Get,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ShipmentsDTO } from './dto/shipmentsDTO';
import { Shipments } from './shipments.entity';
import { ShipmentCurrentTasksDTO } from './dto/ShipmentCurrentTasksDTO';
import { CurrentTasksBusinessService } from 'src/features/current-tasks-business/current-tasks-business.service';

@Controller('shipments')
export class ShipmentsController {
  constructor(
    private readonly service: ShipmentsService,

    @Inject(forwardRef(() => CurrentTasksBusinessService))
    private readonly currentTaskBusiness: CurrentTasksBusinessService,
  ) {}

  @Post('create')
  async create(@Body() data: ShipmentCurrentTasksDTO) {
    return await this.currentTaskBusiness.init(data);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: ShipmentsDTO) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }

  @Get('get')
  async findAll() {
    return await this.service.findAll();
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Get('tree')
  async getTree() {
    return await this.service.getTree();
  }
}
