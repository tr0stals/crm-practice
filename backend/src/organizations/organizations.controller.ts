import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsDTO } from './dto/OrganizationsDTO';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post('create')
  async create(@Body() createOrganization: OrganizationsDTO) {
    return await this.organizationsService.create(createOrganization);
  }

  @Get('get')
  async get() {
    return await this.organizationsService.get();
  }

  @Patch('update/:id')
  async update(@Param('id') id: number, data: OrganizationsDTO) {
    return await this.organizationsService.update(id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return await this.organizationsService.remove(id);
  }
}
