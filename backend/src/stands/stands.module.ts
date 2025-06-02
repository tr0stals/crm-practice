import { Module } from '@nestjs/common';
import { StandsService } from './stands.service';

@Module({
  providers: [StandsService]
})
export class StandsModule {}
