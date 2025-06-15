import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PcbsController } from './pcbs.controller';
import { PcbsService } from './pcbs.service';
import { PCBS } from './pcbs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PCBS])],
  controllers: [PcbsController],
  providers: [PcbsService],
  exports: [PcbsService]
})
export class PcbsModule {}
