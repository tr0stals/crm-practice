import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandPackagesController } from './stand_packages.controller';
import { StandPackagesService } from './stand_packages.service';
import { StandPackages } from './stand_packages.entity';
import { StandsModule } from 'src/stands/stands.module';

@Module({
  imports: [TypeOrmModule.forFeature([StandPackages]), StandsModule],
  controllers: [StandPackagesController],
  providers: [StandPackagesService],
  exports: [StandPackagesService],
})
export class StandPackagesModule {}
