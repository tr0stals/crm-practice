import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesDTO } from './dto/EmployeesDTO';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post('create')
  async create(@Body() data: EmployeesDTO) {
    return await this.employeesService.create(data);
  }

  @Get('get')
  async getAll() {
    return await this.employeesService.getAll();
  }

  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() data: EmployeesDTO) {
    return await this.employeesService.update(id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return await this.employeesService.delete(id);
  }
} 