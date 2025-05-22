import { Module } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { TutorsController } from './tutors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutors } from './tutors.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tutors])],
  providers: [TutorsService],
  controllers: [TutorsController],
  exports: [TutorsService],
})
export class TutorsModule {}
