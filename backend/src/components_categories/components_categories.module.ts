import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentsCategories } from './components_categories.entity';
import { ComponentsSubcategories } from './components_subcategories.entity';
import { ComponentsCategoriesService } from './components_categories.service';
import { ComponentsCategoriesController } from './components_categories.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComponentsCategories, ComponentsSubcategories]),
  ],
  providers: [ComponentsCategoriesService],
  controllers: [ComponentsCategoriesController],
  exports: [ComponentsCategoriesService, TypeOrmModule],
})
export class ComponentsCategoriesModule {}


