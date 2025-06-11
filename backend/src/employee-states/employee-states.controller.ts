import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeeStatesService } from './employee-states.service';
import { CreateEmployeeStateDto } from './dto/create-employee-state.dto';
import { UpdateEmployeeStateDto } from './dto/update-employee-state.dto';

@Controller('employee-states')
export class EmployeeStatesController {
  constructor(private readonly employeeStatesService: EmployeeStatesService) {}

  @Post()
  create(@Body() createEmployeeStateDto: CreateEmployeeStateDto) {
    return this.employeeStatesService.create(createEmployeeStateDto);
  }

  @Get()
  findAll() {
    return this.employeeStatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeStatesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeStateDto: UpdateEmployeeStateDto,
  ) {
    return this.employeeStatesService.update(+id, updateEmployeeStateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeStatesService.remove(+id);
  }
}
