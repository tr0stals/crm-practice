import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmployeesProfessionsService } from './employees-professions.service';
import { AssignProfessionDTO } from './dto/AssignProfessionDTO';

@Controller('employees-professions')
export class EmployeesProfessionsController {
  constructor(
    private readonly employeesProfessionsService: EmployeesProfessionsService,
  ) {}

  @Post('assignProfession')
  async assignProfession(@Body() data: AssignProfessionDTO) {
    return await this.employeesProfessionsService.assignProfession(data);
  }

  @Get('getDataForAdditional')
  async getDataForAdditional() {
    return await this.employeesProfessionsService.getDataForAdditional();
  }
}
