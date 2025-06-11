import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { EmployeeTasksService } from './employee-tasks.service';
import { EmployeeTasks } from './employee-tasks.entity';

@Controller('employee-tasks')
export class EmployeeTasksController {
  constructor(private readonly service: EmployeeTasksService) {}

  @Post()
  create(@Body() data: Partial<EmployeeTasks>) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<EmployeeTasks>) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
} 