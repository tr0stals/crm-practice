import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandCoursesController } from './stand-courses.controller';
import { StandCoursesService } from './stand-courses.service';
import { StandCourses } from './stand-courses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StandCourses])],
  controllers: [StandCoursesController],
  providers: [StandCoursesService],
  exports: [StandCoursesService],
})
export class StandCoursesModule {}
