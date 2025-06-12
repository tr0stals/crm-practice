import { Module } from '@nestjs/common';
import { StandsService } from './stands.service';
import { StandsController } from './stands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stands } from './stands.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stands])],
  providers: [StandsService],
  controllers: [StandsController],
})
export class StandsModule {}
