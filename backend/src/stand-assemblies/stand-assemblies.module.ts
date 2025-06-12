import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandAssembliesController } from './stand-assemblies.controller';
import { StandAssembliesService } from './stand-assemblies.service';
import { StandAssemblies } from './stand-assemblies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StandAssemblies])],
  controllers: [StandAssembliesController],
  providers: [StandAssembliesService],
  exports: [StandAssembliesService],
})
export class StandAssembliesModule {}
