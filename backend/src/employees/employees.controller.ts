import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeesService } from './employees.service';
<<<<<<< HEAD
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
=======
import { EmployeesDTO } from './dto/EmployeesDTO';
>>>>>>> main

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

<<<<<<< HEAD
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
=======
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
>>>>>>> main
  }
} 