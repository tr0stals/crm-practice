import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { EmployeeUnitService } from './employee-unit.service';
import { CreateEmployeeUnitDTO } from './dto/CreateEmployeeUnitDTO';
import { UpdateEmployeeUnitDTO } from './dto/UpdateEmployeeUnitDTO';

@Controller('employee_unit')
export class EmployeeUnitController {
  constructor(private employeeUnitService: EmployeeUnitService) {}

  @Get('get/:employeeId')
  async get(@Param('employeeId') employeeId: string) {
    return await this.employeeUnitService.getEmployeesUnit(+employeeId);
  }

  @Post('create')
  async create(@Body() data: CreateEmployeeUnitDTO) {
    return await this.employeeUnitService.create(data);
  }

  @Get('getFormMetaData')
  async getFormMetaData() {
    return await this.employeeUnitService.getEmployeeUnitFormMetadata();
  }

  /**
   *
   * @param id employeeId - id сотрудника, информацию которого меняют
   * @param data
   * @returns
   */
  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() data: UpdateEmployeeUnitDTO) {
    return await this.employeeUnitService.update(id, data);
  }
}
