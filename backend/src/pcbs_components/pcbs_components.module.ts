import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PcbsComponents } from './pcbs_components.entity';
import { PcbsComponentsService } from './pcbs_components.service';
import { PcbsComponentsController } from './pcbs_components.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PcbsComponents])],
  controllers: [PcbsComponentsController],
  providers: [PcbsComponentsService],
  exports: [TypeOrmModule],
})
export class PcbsComponentsModule {} 