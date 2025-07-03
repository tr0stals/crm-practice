import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentsStands } from './shipments_stands.entity';
import { ShipmentsStandsService } from './shipments_stands.service';
import { ShipmentsStandsController } from './shipments_stands.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentsStands])],
  providers: [ShipmentsStandsService],
  controllers: [ShipmentsStandsController],
  exports: [ShipmentsStandsService],
})
export class ShipmentsStandsModule {}
