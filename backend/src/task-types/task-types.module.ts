import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskTypes } from './task-types.entity';
import { TaskTypesService } from './task-types.service';
import { TaskTypesController } from './task-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaskTypes])],
  providers: [TaskTypesService],
  controllers: [TaskTypesController],
  exports: [TaskTypesService],
})
export class TaskTypesModule {} 