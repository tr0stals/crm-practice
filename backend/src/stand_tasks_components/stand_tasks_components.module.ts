import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandTasksComponents } from './stand_tasks_components.entity';
import { StandTasksComponentsService } from './stand_tasks_components.service';
import { StandTasksComponentsController } from './stand_tasks_components.controller';
import { ComponentsModule } from 'src/components/components.module';
import { StandTasksModule } from 'src/stand_tasks/stand_tasks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StandTasksComponents]),
    ComponentsModule,
    StandTasksModule,
  ],
  controllers: [StandTasksComponentsController],
  providers: [StandTasksComponentsService],
  exports: [TypeOrmModule],
})
export class StandTasksComponentsModule {}
