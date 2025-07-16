import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentPlacements } from './component_placements.entity';
import { ComponentPlacementsService } from './component_placements.service';
import { ComponentPlacementsController } from './component_placements.controller';
import { ComponentPlacementType } from 'src/component_placement_type/component_placement_type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComponentPlacements, ComponentPlacementType]),
  ],
  controllers: [ComponentPlacementsController],
  providers: [ComponentPlacementsService],
  exports: [TypeOrmModule],
})
export class ComponentPlacementsModule {}
