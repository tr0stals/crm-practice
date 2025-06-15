import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { Countries } from './countries.entity';

@Controller('countries')
export class CountriesController {
  constructor(private readonly service: CountriesService) {}

  @Post('create')
  async create(@Body() data: Partial<Countries>) {
    return await this.service.create(data);
  }

  @Get('get')
  async findAll() {
    return await this.service.findAll();
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<Countries>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
