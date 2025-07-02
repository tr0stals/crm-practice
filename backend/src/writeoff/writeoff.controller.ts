import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { WriteoffService } from './writeoff.service';
import { Writeoff } from './writeoff.entity';

@Controller('writeoff')
export class WriteoffController {
  constructor(private readonly service: WriteoffService) {}

  @Get('get')
  async getAll() {
    return this.service.getAll();
  }

  @Get('get/:id')
  async getOne(@Param('id') id: string) {
    return this.service.getOne(+id);
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Post('create')
  async create(@Body() data: Partial<Writeoff>) {
    return this.service.create(data);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<Writeoff>) {
    return this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
