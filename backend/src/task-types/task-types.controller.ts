import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { TaskTypesService } from './task-types.service';
import { TaskTypes } from './task-types.entity';

@Controller('task-types')
export class TaskTypesController {
  constructor(private readonly service: TaskTypesService) {}

  @Post('create')
  async create(@Body() data: Partial<TaskTypes>) {
    return await this.service.create(data);
  }

  @Get('get')
  async findAll() {
    return await this.service.findAll();
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<TaskTypes>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
} 