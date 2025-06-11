import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { EmployeeDepartmentsService } from './employee-departments.service';
import { EmployeeDepartments } from './employee-departments.entity';

@Controller('employee-departments')
export class EmployeeDepartmentsController {
  constructor(private readonly service: EmployeeDepartmentsService) {}

  @Post()
  create(@Body() data: Partial<EmployeeDepartments>) {
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
  update(@Param('id') id: string, @Body() data: Partial<EmployeeDepartments>) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
