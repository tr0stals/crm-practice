import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentsStands } from './shipments-stands.entity';
import { ShipmentsStandsService } from './shipments-stands.service';
import { ShipmentsStandsController } from './shipments-stands.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentsStands])],
  providers: [ShipmentsStandsService],
  controllers: [ShipmentsStandsController],
  exports: [ShipmentsStandsService],
})
export class ShipmentsStandsModule {}
