import { Module } from '@nestjs/common';
import { PeoplesController } from './peoples.controller';
import { PeoplesService } from './peoples.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Peoples } from './peoples.entity';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { Organizations } from 'src/organizations/organizations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Peoples, Organizations])],
  controllers: [PeoplesController],
  providers: [PeoplesService],
  exports: [PeoplesService],
})
export class PeoplesModule {}
