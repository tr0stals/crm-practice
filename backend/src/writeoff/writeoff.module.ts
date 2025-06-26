import { Module } from '@nestjs/common';
import { WriteoffController } from './writeoff.controller';
import { WriteoffService } from './writeoff.service';

@Module({
  controllers: [WriteoffController],
  providers: [WriteoffService]
})
export class WriteoffModule {}
