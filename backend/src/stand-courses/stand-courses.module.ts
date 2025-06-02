import { Module } from '@nestjs/common';
import { StandCoursesService } from './stand-courses.service';

@Module({
  providers: [StandCoursesService]
})
export class StandCoursesModule {}
