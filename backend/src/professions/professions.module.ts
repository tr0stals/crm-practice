import { Module } from '@nestjs/common';
import { ProfessionsController } from './professions.controller';
import { ProfessionsService } from './professions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professions } from './professions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Professions])],
  controllers: [ProfessionsController],
  providers: [ProfessionsService],
  exports: [ProfessionsService],
})
export class ProfessionsModule {}
