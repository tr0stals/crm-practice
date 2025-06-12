import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandsController } from './stands.controller';
import { StandsService } from './stands.service';
import { Stands } from './stands.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stands])],
  controllers: [StandsController],
  providers: [StandsService],
  exports: [StandsService],
})
export class StandsModule {}
