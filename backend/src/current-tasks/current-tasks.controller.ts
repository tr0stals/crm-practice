import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CurrentTasksService } from './current-tasks.service';
import { CurrentTasks } from './current-tasks.entity';

@Controller('current-tasks')
export class CurrentTasksController {
  constructor(private readonly service: CurrentTasksService) {}

  @Post('create')
  async create(@Body() data: Partial<CurrentTasks>) {
    return await this.service.create(data);
  }

  @Get('get')
  async findAll() {
    return await this.service.findAll();
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<CurrentTasks>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
} 