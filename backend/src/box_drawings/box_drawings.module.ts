import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoxDrawings } from './box_drawings.entity';
import { BoxDrawingsService } from './box_drawings.service';
import { BoxDrawingsController } from './box_drawings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BoxDrawings])],
  providers: [BoxDrawingsService],
  controllers: [BoxDrawingsController],
})
export class BoxDrawingsModule {}