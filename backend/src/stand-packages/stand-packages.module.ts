import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandPackagesController } from './stand-packages.controller';
import { StandPackagesService } from './stand-packages.service';
import { StandPackages } from './stand-packages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StandPackages])],
  controllers: [StandPackagesController],
  providers: [StandPackagesService],
  exports: [StandPackagesService],
})
export class StandPackagesModule {}
