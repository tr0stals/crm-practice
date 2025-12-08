import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EmployeesProfessionsService } from './employees_professions.service';
import { EmployeesProfessions } from './employees_professions.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AssignProfessionDTO } from './dto/AssignProfessionDTO';
import { EmployeesProfessionsDTO } from './dto/EmployeesProfessionsDTO';

@UseGuards(JwtAuthGuard)
@Controller('employees_professions')
export class EmployeesProfessionsController {
  constructor(private readonly service: EmployeesProfessionsService) {}

  @Post('create')
  async create(@Body() data: EmployeesProfessionsDTO) {
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

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Get('getAllByEmployeeId/:id')
  async getAllByEmployeeId(@Param('id') id: number) {
    return await this.service.getAllByEmployeeId(id);
  }

  @Get('getByEmployeeId/:id')
  async getByEmployeeId(@Param('id') id: string) {
    return await this.service.findEmployeeProfessionByEmployeeId(+id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<EmployeesProfessions>,
  ) {
    return await this.service.update(+id, data);
  }

  @Post('assignProfession')
  async assignProfession(@Body() data: AssignProfessionDTO) {
    return await this.service.assignProfession(data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(+id);
  }

  @Get('getDataForAdditional')
  async getDataForAdditional() {
    return await this.service.getDataForAdditional();
  }
}
