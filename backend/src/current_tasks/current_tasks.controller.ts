import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CurrentTasksService } from './current_tasks.service';
import { CurrentTasks } from './current_tasks.entity';
import { CurrentTasksDTO } from './dto/CurrentTasksDTO';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EmployeesProfessionsService } from 'src/employees_professions/employees_professions.service';

@Controller('current_tasks')
export class CurrentTasksController {
  constructor(
    private readonly service: CurrentTasksService,
    private readonly employeesProfessionsService: EmployeesProfessionsService,
  ) {}

  @Post('create')
  async create(@Body() data: CurrentTasksDTO) {
    return await this.service.create(data);
  }

  @Get('get')
  async findAll() {
    return await this.service.findAll();
  }

  @Get('generateData')
  async generateData() {
    return await this.service.generateData();
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<CurrentTasks>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tree')
  async getCurrentTasksTree(@Request() req) {
    const employeeId = req.user?.employees?.id || req.user?.employeeId;
    if (!employeeId) {
      return { name: 'Текущие задачи', children: [] };
    }
    const empProf = await this.employeesProfessionsService.findEmployeeProfessionByEmployeeId(employeeId);
    console.log('!!!!!', empProf);
    const role = empProf?.professions?.title?.toLowerCase() || '';
    const allowedRoles = ['директор', 'администратор', 'test'];
    if (allowedRoles.some((r) => role.includes(r))) {
      return await this.service.getCurrentTasksTreeForAll();
    } else {
      return await this.service.getCurrentTasksTreeForEmployee(employeeId);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('myTree')
  async getCurrentTasksTreeForEmployee(@Request() req) {
    // employeeId можно получить через req.user.employees?.id или req.user.employeeId
    const employeeId = req.user?.employees?.id || req.user?.employeeId;
    if (!employeeId) {
      return { name: 'Мои задачи', children: [] };
    }
    return await this.service.getCurrentTasksTreeForEmployee(employeeId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('start/:taskId')
  async startTask(@Param('taskId') taskId: string, @Request() req) {
    const employeeId = req.user?.employees?.id || req.user?.employeeId;
    if (!employeeId) {
      throw new Error('Нет сотрудника в токене');
    }
    return await this.service.startTask(+taskId, employeeId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('complete/:taskId')
  async completeTask(@Param('taskId') taskId: string) {
    return await this.service.completeTask(+taskId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('title/:id')
  async getTaskTitle(@Param('id') id: string) {
    const task = await this.service.findOne(+id);
    return { id: task.id, title: task.title };
  }

  @Get('titles')
  async getAllTaskTitles() {
    const tasks = await this.service.findAll();
    return tasks.map((task) => ({ id: task.id, title: task.title }));
  }

  @Get('rootStandTasks')
  async getRootStandTasks() {
    return await this.service.getRootStandTasks();
  }
}
