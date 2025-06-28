import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PcbsComponents } from './pcbs-components.entity';
import { PcbsComponentsService } from './pcbs-components.service';
import { PcbsComponentsController } from './pcbs-components.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PcbsComponents])],
  controllers: [PcbsComponentsController],
  providers: [PcbsComponentsService],
  exports: [TypeOrmModule],
})
export class PcbsComponentsModule {} 