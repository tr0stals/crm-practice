import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LicenseTypesService } from './license-types.service';
import { LicenseTypeDTO } from './dto/LicenseTypeDTO';

@Controller('license_types')
export class LicenseTypesController {
  constructor(private readonly licenseTypesService: LicenseTypesService) {}

  @Post('create')
  async createLicenseType(@Body() data: LicenseTypeDTO) {
    return await this.licenseTypesService.createLicenseType(data);
  }

  @Get('get')
  async getLicenseTypes() {
    return await this.licenseTypesService.getLicenseTypes();
  }

  @Get('get/:id')
  async getLicenseTypeById(@Param('id') id: number) {
    return await this.licenseTypesService.findById(id);
  }

  @Patch('update/:id')
  async update(@Param('id') id, @Body() updateLicense: LicenseTypeDTO) {
    return this.licenseTypesService.update(id, updateLicense);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id) {
    return this.licenseTypesService.remove(id);
  }
}
