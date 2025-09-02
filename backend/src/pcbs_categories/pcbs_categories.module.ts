import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PcbsCategories } from './pcbs_categories.entity';
import { PcbsSubcategories } from './pcbs_subcategories.entity';
import { PcbsCategoriesService } from './pcbs_categories.service';
import { PcbsCategoriesController } from './pcbs_categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PcbsCategories, PcbsSubcategories])],
  providers: [PcbsCategoriesService],
  controllers: [PcbsCategoriesController],
  exports: [PcbsCategoriesService, TypeOrmModule],
})
export class PcbsCategoriesModule {}


