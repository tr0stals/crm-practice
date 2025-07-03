import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WriteoffReasons } from './writeoff_reasons.entity';
import { WriteoffReasonsService } from './writeoff_reasons.service';
import { WriteoffReasonsController } from './writeoff_reasons.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WriteoffReasons])],
  providers: [WriteoffReasonsService],
  controllers: [WriteoffReasonsController],
  exports: [WriteoffReasonsService],
})
export class WriteoffReasonsModule {}
