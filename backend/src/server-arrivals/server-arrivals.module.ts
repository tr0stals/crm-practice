import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerArrivals } from './server-arrivals.entity';
import { ServerArrivalsService } from './server-arrivals.service';
import { ServerArrivalsController } from './server-arrivals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServerArrivals])],
  providers: [ServerArrivalsService],
  controllers: [ServerArrivalsController],
  exports: [ServerArrivalsService],
})
export class ServerArrivalsModule {}
