import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { CurrentTasksService } from './current_tasks.service';
import { CurrentTasks } from './current_tasks.entity';
import { CurrentTasksDTO } from './dto/CurrentTasksDTO';

@Controller('current_tasks')
export class CurrentTasksController {
  constructor(private readonly service: CurrentTasksService) {}

  @Post('create')
  async create(@Body() data: CurrentTasksDTO) {
    return await this.service.create(data);
  }

  @Get('get')
  async findAll() {
    return await this.service.findAll();
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
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
