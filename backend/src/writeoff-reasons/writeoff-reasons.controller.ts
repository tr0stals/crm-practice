import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { WriteoffReasonsService } from './writeoff-reasons.service';
import { WriteoffReasons } from './writeoff-reasons.entity';

@Controller('writeoff-reasons')
export class WriteoffReasonsController {
  constructor(private readonly service: WriteoffReasonsService) {}

  @Get('get')
  async getAll() {
    return this.service.getAll();
  }

  @Get('get/:id')
  async getOne(@Param('id') id: string) {
    return this.service.getOne(+id);
  }

  @Post('create')
  async create(@Body() data: Partial<WriteoffReasons>) {
    return this.service.create(data);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<WriteoffReasons>) {
    return this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
