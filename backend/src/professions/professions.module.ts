import { Module } from '@nestjs/common';
import { ProfessionsController } from './professions.controller';
import { ProfessionsService } from './professions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professions } from './professions.entity';
import { ProfessionsInitializerService } from './professions.initializer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Professions])],
  controllers: [ProfessionsController],
  providers: [ProfessionsService, ProfessionsInitializerService],
  exports: [ProfessionsService],
})
export class ProfessionsModule {}
