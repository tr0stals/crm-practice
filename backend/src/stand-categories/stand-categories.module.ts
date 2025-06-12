import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandCategoriesController } from './stand-categories.controller';
import { StandCategoriesService } from './stand-categories.service';
import { StandCategories } from './stand-categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StandCategories])],
  controllers: [StandCategoriesController],
  providers: [StandCategoriesService],
  exports: [StandCategoriesService],
})
export class StandCategoriesModule {}
