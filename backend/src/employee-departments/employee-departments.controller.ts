import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { EmployeeDepartmentsService } from './employee-departments.service';
import { EmployeeDepartments } from './employee-departments.entity';

@Controller('employee-departments')
export class EmployeeDepartmentsController {
  constructor(private readonly service: EmployeeDepartmentsService) {}

  @Post('create')
  async create(@Body() data: Partial<EmployeeDepartments>) {
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
  async update(@Param('id') id: string, @Body() data: Partial<EmployeeDepartments>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
