import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Components } from './components.entity';
import { ComponentsCategoriesModule } from 'src/components_categories/components_categories.module';
import { ComponentsService } from './components.service';
import { ComponentsController } from './components.controller';
import { ComponentPlacementsModule } from 'src/component_placements/component_placements.module';
import { ComponentPlacements } from 'src/component_placements/component_placements.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Components, ComponentPlacements]),
    ComponentPlacementsModule,
    ComponentsCategoriesModule,
  ],
  providers: [ComponentsService],
  controllers: [ComponentsController],
  exports: [ComponentsService],
})
export class ComponentsModule {}
