import { Module } from '@nestjs/common';
import { StandAssembliesController } from './stand-assemblies.controller';
import { StandAssembliesService } from './stand-assemblies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandAssemblies } from './stand-assemblies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StandAssemblies])],
  controllers: [StandAssembliesController],
  providers: [StandAssembliesService]
})
export class StandAssembliesModule {}
