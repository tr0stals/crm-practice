import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Countries } from './countries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Countries])],
  controllers: [CountriesController],
  providers: [CountriesService],
  exports: [CountriesService],
})
export class CountriesModule {}
