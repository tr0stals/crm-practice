import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendingBoxes } from './sending_boxes.entity';
import { SendingBoxesService } from './sending_boxes.service';
import { SendingBoxesController } from './sending_boxes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SendingBoxes])],
  providers: [SendingBoxesService],
  controllers: [SendingBoxesController],
})
export class SendingBoxesModule {}