import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
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

  @Patch('update/:id')
  async update(@Param('id') id, @Body() updateLicense: LicenseTypeDTO) {
    return this.licenseTypesService.update(id, updateLicense);
  }
}
