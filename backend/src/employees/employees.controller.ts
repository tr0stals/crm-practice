import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesDTO } from './dto/EmployeesDTO';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Сотрудники')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiOperation({ summary: 'Создание нового сотрудника' })
  @ApiResponse({ status: 201, description: 'Сотрудник успешно создан' })
  @Post('create')
  async create(@Body() data: EmployeesDTO) {
    return await this.employeesService.create(data);
  }

  @ApiOperation({ summary: 'Получение списка всех сотрудников' })
  @ApiResponse({
    status: 200,
    description: 'Список сотрудников получен успешно',
  })
  @Get('get')
  async getAll() {
    return await this.employeesService.getAll();
  }

  @ApiOperation({ summary: 'Получение сотрудника по ID' })
  @ApiResponse({ status: 200, description: 'Сотрудник найден' })
  @ApiResponse({ status: 404, description: 'Сотрудник не найден' })
  @Get('get/:id')
  async getOne(@Param('id') id: string) {
    return await this.employeesService.getEmployeeWithProfession(+id);
  }

  @ApiOperation({ summary: 'Обновление данных сотрудника' })
  @ApiResponse({ status: 200, description: 'Данные сотрудника обновлены' })
  @ApiResponse({ status: 404, description: 'Сотрудник не найден' })
  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: EmployeesDTO) {
    return await this.employeesService.update(+id, data);
  }

  @ApiOperation({ summary: 'Удаление сотрудника' })
  @ApiResponse({ status: 200, description: 'Сотрудник удален' })
  @ApiResponse({ status: 404, description: 'Сотрудник не найден' })
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.employeesService.delete(+id);
  }

  @ApiOperation({
    summary: 'Автоматическое назначение профессии IT-специалист',
  })
  @ApiResponse({ status: 201, description: 'Профессия успешно назначена' })
  @ApiResponse({ status: 404, description: 'Человек не найден' })
  @ApiResponse({ status: 403, description: 'Сотрудник уже существует' })
  @Post('assign-default-profession/:peopleId')
  async assignDefaultProfession(@Param('peopleId') peopleId: string) {
    return await this.employeesService.assignDefaultProfession(+peopleId);
  }

  @ApiOperation({ summary: 'Изменение профессии сотрудника' })
  @ApiResponse({ status: 200, description: 'Профессия успешно изменена' })
  @ApiResponse({
    status: 404,
    description: 'Сотрудник или профессия не найдены',
  })
  @ApiResponse({
    status: 403,
    description: 'Недостаточно прав для изменения профессии',
  })
  @Patch('change-profession/:employeeId/:professionId')
  async changeProfession(
    @Param('employeeId') employeeId: string,
    @Param('professionId') professionId: string,
  ) {
    return await this.employeesService.changeEmployeeProfession(
      +employeeId,
      +professionId,
    );
  }
}
