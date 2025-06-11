import { Module } from '@nestjs/common';
import { PcbsController } from './pcbs.controller';
import { PcbsService } from './pcbs.service';

@Module({
  controllers: [PcbsController],
  providers: [PcbsService]
})
export class PcbsModule {}
