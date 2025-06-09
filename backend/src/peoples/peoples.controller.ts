import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PeoplesService } from './peoples.service';
import { PeoplesDTO } from './dto/PeoplesDTO';

@Controller('peoples')
export class PeoplesController {
  constructor(private readonly peoplesService: PeoplesService) {}

  @Post('create')
  async createPeople(@Body() data: PeoplesDTO) {
    return await this.peoplesService.create(data);
  }

  @Get('get')
  async getPeoples() {
    return await this.peoplesService.getPeoples();
  }

  @Patch('update/:id')
  async updatePeople(@Param('id') id: number, @Body() people: PeoplesDTO) {
    return await this.peoplesService.update(id, people);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id) {
    return this.peoplesService.remove(id);
  }
}
