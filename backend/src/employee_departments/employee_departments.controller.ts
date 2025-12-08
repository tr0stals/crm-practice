import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { EmployeeDepartmentsService } from './employee_departments.service';
import { EmployeeDepartments } from './employee_departments.entity';
import { EmployeesDepartmentsDTO } from './dto/EmployeesDepartmentsDTO';

@Controller('employee_departments')
export class EmployeeDepartmentsController {
  constructor(private readonly service: EmployeeDepartmentsService) {}

  @Post('create')
  async create(@Body() data: EmployeesDepartmentsDTO) {
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

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Get('getByEmployeeId/:id')
  async getByEmployeeId(@Param('id') id: string) {
    return await this.service.getByEmployeeId(+id);
  }

  @Get('getByDepartmentId/:id')
  async getByDepartmentId(@Param('id') id: number) {
    return await this.service.getByDepartmentId(id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<EmployeeDepartments>,
  ) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
