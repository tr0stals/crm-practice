import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentsStands } from './shipments_stands.entity';
import { ShipmentsStandsService } from './shipments_stands.service';
import { ShipmentsStandsController } from './shipments_stands.controller';
import { ShipmentsModule } from 'src/shipments/shipments.module';
import { StandsModule } from 'src/stands/stands.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShipmentsStands]),
    ShipmentsModule,
    StandsModule,
  ],
  providers: [ShipmentsStandsService],
  controllers: [ShipmentsStandsController],
  exports: [ShipmentsStandsService],
})
export class ShipmentsStandsModule {}
