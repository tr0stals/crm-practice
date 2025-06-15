import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { EmployeeTasksService } from './employee-tasks.service';
import { EmployeeTasks } from './employee-tasks.entity';

@Controller('employee-tasks')
export class EmployeeTasksController {
  constructor(private readonly service: EmployeeTasksService) {}

  @Post('create')
  async create(@Body() data: Partial<EmployeeTasks>) {
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
  async update(@Param('id') id: string, @Body() data: Partial<EmployeeTasks>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
} 