import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { EmployeeStatesService } from './employee-states.service';
import { EmployeeStates } from './employee-states.entity';

@Controller('employee-states')
export class EmployeeStatesController {
  constructor(private readonly service: EmployeeStatesService) {}

  @Post('create')
  async create(@Body() data: Partial<EmployeeStates>) {
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
  async update(@Param('id') id: string, @Body() data: Partial<EmployeeStates>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
