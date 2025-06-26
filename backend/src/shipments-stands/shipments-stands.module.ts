import { Module } from '@nestjs/common';
import { ShipmentsStandsController } from './shipments-stands.controller';
import { ShipmentsStandsService } from './shipments-stands.service';

@Module({
  controllers: [ShipmentsStandsController],
  providers: [ShipmentsStandsService]
})
export class ShipmentsStandsModule {}
