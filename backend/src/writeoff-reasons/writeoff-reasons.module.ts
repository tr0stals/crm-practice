import { Module } from '@nestjs/common';
import { WriteoffReasonsController } from './writeoff-reasons.controller';
import { WriteoffReasonsService } from './writeoff-reasons.service';

@Module({
  controllers: [WriteoffReasonsController],
  providers: [WriteoffReasonsService]
})
export class WriteoffReasonsModule {}
