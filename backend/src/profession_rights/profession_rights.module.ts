import { Module } from '@nestjs/common';
import { ProfessionRightsController } from './profession_rights.controller';
import { ProfessionRightsService } from './profession_rights.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionRights } from './profession_rights.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionRights])],
  controllers: [ProfessionRightsController],
  providers: [ProfessionRightsService],
  exports: [ProfessionRightsService],
})
export class ProfessionRightsModule {}
