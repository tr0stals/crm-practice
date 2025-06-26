import { Module } from '@nestjs/common';
import { ServerArrivalsController } from './server-arrivals.controller';
import { ServerArrivalsService } from './server-arrivals.service';

@Module({
  controllers: [ServerArrivalsController],
  providers: [ServerArrivalsService]
})
export class ServerArrivalsModule {}
