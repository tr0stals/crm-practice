import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { StandsService } from './stands.service';
import { Stands } from './stands.entity';
import { StandsDTO } from './dto/StandsDTO';

@Controller('stands')
export class StandsController {
  constructor(private readonly service: StandsService) {}

  @Post('create')
  async create(@Body() data: StandsDTO) {
    return await this.service.create(data);
  }

  @Get('get')
  async findAll() {
    return await this.service.findAll();
  }

  @Get('get/:id')
  async getOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }

  @Get('getParents')
  async getParents() {
    return await this.service.getParents();
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Get('tree')
  async getTree() {
    return await this.service.getTree();
  }

  @Get('getTree')
  async getTreeWithParent() {
    return await this.service.getTreeWithParent();
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<Stands>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
