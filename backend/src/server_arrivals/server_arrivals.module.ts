import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerArrivals } from './server_arrivals.entity';
import { ServerArrivalsService } from './server_arrivals.service';
import { ServerArrivalsController } from './server_arrivals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServerArrivals])],
  providers: [ServerArrivalsService],
  controllers: [ServerArrivalsController],
  exports: [ServerArrivalsService],
})
export class ServerArrivalsModule {}
