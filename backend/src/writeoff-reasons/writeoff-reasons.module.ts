import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WriteoffReasons } from './writeoff-reasons.entity';
import { WriteoffReasonsService } from './writeoff-reasons.service';
import { WriteoffReasonsController } from './writeoff-reasons.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WriteoffReasons])],
  providers: [WriteoffReasonsService],
  controllers: [WriteoffReasonsController],
  exports: [WriteoffReasonsService],
})
export class WriteoffReasonsModule {}
