import { Module } from '@nestjs/common';
import { StandAssembliesController } from './stand-assemblies.controller';
import { StandAssembliesService } from './stand-assemblies.service';

@Module({
  controllers: [StandAssembliesController],
  providers: [StandAssembliesService]
})
export class StandAssembliesModule {}
