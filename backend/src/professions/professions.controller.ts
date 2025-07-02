import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProfessionsService } from './professions.service';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Профессии')
@Controller('professions')
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @ApiOperation({ summary: 'Создание новой профессии' })
  @ApiResponse({
    status: 201,
    description: 'Профессия успешно создана',
  })
  @ApiResponse({
    status: 409,
    description: 'Профессия с таким названием уже существует',
  })
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProfessionDto: CreateProfessionDto) {
    return await this.professionsService.create(createProfessionDto);
  }

  @ApiOperation({ summary: 'Получение списка всех профессий' })
  @ApiResponse({
    status: 200,
    description: 'Список профессий получен успешно',
  })
  @Get('get')
  async getAll() {
    return await this.professionsService.getAll();
  }

  @ApiOperation({ summary: 'Получение профессии по ID' })
  @ApiResponse({
    status: 200,
    description: 'Профессия найдена',
  })
  @ApiResponse({
    status: 404,
    description: 'Профессия не найдена',
  })
  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    return await this.professionsService.findOne(+id);
  }

  @Get('generateData')
  async generateData() {
    return await this.professionsService.generateData();
  }

  @ApiOperation({ summary: 'Обновление профессии' })
  @ApiResponse({
    status: 200,
    description: 'Профессия успешно обновлена',
  })
  @ApiResponse({
    status: 404,
    description: 'Профессия не найдена',
  })
  @ApiResponse({
    status: 409,
    description: 'Профессия с таким названием уже существует',
  })
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProfessionDto: UpdateProfessionDto,
  ) {
    return await this.professionsService.update(+id, updateProfessionDto);
  }

  @ApiOperation({ summary: 'Удаление профессии' })
  @ApiResponse({
    status: 200,
    description: 'Профессия успешно удалена',
  })
  @ApiResponse({
    status: 404,
    description: 'Профессия не найдена',
  })
  @ApiResponse({
    status: 409,
    description: 'Невозможно удалить используемую профессию',
  })
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.professionsService.delete(+id);
  }
}
