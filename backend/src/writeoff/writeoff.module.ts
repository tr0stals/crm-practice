import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Writeoff } from './writeoff.entity';
import { WriteoffService } from './writeoff.service';
import { WriteoffController } from './writeoff.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Writeoff])],
  providers: [WriteoffService],
  controllers: [WriteoffController],
  exports: [WriteoffService],
})
export class WriteoffModule {}
