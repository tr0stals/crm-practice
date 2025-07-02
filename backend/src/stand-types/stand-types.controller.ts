import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { StandTypesService } from './stand-types.service';
import { StandsTypes } from './stand-types.entity';

@Controller('stand-types')
export class StandTypesController {
  constructor(private readonly service: StandTypesService) {}

  @Post('create')
  async create(@Body() data: Partial<StandsTypes>) {
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

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() data: Partial<StandsTypes>) {
    return await this.service.update(+id, data);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(+id);
  }
}
