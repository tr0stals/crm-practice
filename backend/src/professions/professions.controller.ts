import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfessionsService } from './professions.service';
import { Professions } from './professions.entity';

@Controller('professions')
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @Post('create')
  async create(@Body() data: Professions) {
    return await this.professionsService.create(data);
  }

  @Get('get')
  async getAll() {
    return await this.professionsService.getAll();
  }

  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() data: Professions) {
    return await this.professionsService.update(id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return await this.professionsService.delete(id);
  }
}
