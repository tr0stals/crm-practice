import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EmployeesVacationsService } from './employees-vacations.service';
import { EmployeesVacations } from './employees-vacations.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('employees-vacations')
export class EmployeesVacationsController {
  constructor(private readonly service: EmployeesVacationsService) {}

  @Post('create')
  async create(@Body() data: Partial<EmployeesVacations>) {
    return await this.service.create(data);
  }

  @Get('get')
  async getAll() {
    return await this.service.getAll();
  }

  @Get('get/:id')
  async getOne(@Param('id') id: string) {
    return await this.service.getOne(+id);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<EmployeesVacations>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(+id);
  }
}
