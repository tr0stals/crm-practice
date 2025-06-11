import { Module } from '@nestjs/common';
import { PeoplesController } from './peoples.controller';
import { PeoplesService } from './peoples.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Peoples } from './peoples.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Peoples])],
  controllers: [PeoplesController],
  providers: [PeoplesService],
  exports: [PeoplesService],
})
export class PeoplesModule {}
