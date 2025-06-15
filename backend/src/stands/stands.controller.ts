import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { StandsService } from './stands.service';
import { Stands } from './stands.entity';

@Controller('stands')
export class StandsController {
  constructor(private readonly service: StandsService) {}

  @Post('create')
  async create(@Body() data: Partial<Stands>) {
    return await this.service.create(data);
  }

  @Get('get')
  async findAll() {
    return await this.service.findAll();
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
