import { Module } from '@nestjs/common';
import { StandCategoriesController } from './stand-categories.controller';

@Module({
  controllers: [StandCategoriesController]
})
export class StandCategoriesModule {}
