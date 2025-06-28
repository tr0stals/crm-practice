import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentPlacementType } from './component_placement_type.entity';
import { ComponentPlacementTypeService } from './component_placement_type.service';
import { ComponentPlacementTypeController } from './component_placement_type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentPlacementType])],
  controllers: [ComponentPlacementTypeController],
  providers: [ComponentPlacementTypeService],
  exports: [TypeOrmModule],
})
export class ComponentPlacementTypeModule {} 