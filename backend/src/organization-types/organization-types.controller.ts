import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrganizationTypesService } from './organization-types.service';
import { OrganizationTypesDTO } from './dto/OrganizationTypesDTO';

@Controller('organization-types')
export class OrganizationTypesController {
  constructor(
    private readonly organizationTypesService: OrganizationTypesService,
  ) {}

  @Post('create')
  async create(@Body() createOrganizationType: OrganizationTypesDTO) {
    return this.organizationTypesService.create(createOrganizationType);
  }

  @Get('get')
  async get() {
    return await this.organizationTypesService.get();
  }

  @Get('generateData')
  async generateData() {
    return await this.organizationTypesService.generateData();
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: number,
    @Body() updateData: OrganizationTypesDTO,
  ) {
    return this.organizationTypesService.update(id, updateData);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: number) {
    return await this.organizationTypesService.remove(id);
  }
}
