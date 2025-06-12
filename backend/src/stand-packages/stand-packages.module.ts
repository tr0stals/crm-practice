import { Module } from '@nestjs/common';
import { StandPackagesController } from './stand-packages.controller';
import { StandPackagesService } from './stand-packages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandPackages } from './stand-packages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StandPackages])],
  controllers: [StandPackagesController],
  providers: [StandPackagesService]
})
export class StandPackagesModule {}
