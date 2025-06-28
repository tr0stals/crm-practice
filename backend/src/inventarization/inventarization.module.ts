import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventarization } from './inventarization.entity';
import { InventarizationService } from './inventarization.service';
import { InventarizationController } from './inventarization.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Inventarization])],
  controllers: [InventarizationController],
  providers: [InventarizationService],
  exports: [TypeOrmModule],
})
export class InventarizationModule {} 