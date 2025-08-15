import { Controller, Get } from '@nestjs/common';
import { ProfessionRightsService } from './profession_rights.service';

@Controller('profession_rights')
export class ProfessionRightsController {
  constructor(
    private readonly professionRightsService: ProfessionRightsService,
  ) {}

  @Get('get')
  async getProfessionRights() {
    return await this.professionRightsService.getProfessions();
  }

  @Get('getProfessions')
  async getAllProfessions() {
    return await this.professionRightsService.getAllProfessions();
  }

  @Get('getAll')
  async getAll() {
    return await this.professionRightsService.getAll();
  }
}
