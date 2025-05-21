import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from './region.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Region])],
  providers: [RegionService],
  controllers: [RegionController],
  exports: [RegionService],
})
export class RegionModule {}
