import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizations } from './organizations.entity';
import { OrganizationTypesModule } from 'src/organization_types/organization_types.module';
import { PeoplesModule } from 'src/peoples/peoples.module';
import { Images } from 'src/images/images.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organizations, Images]),
    OrganizationTypesModule,
    PeoplesModule,
  ],
  providers: [OrganizationsService],
  controllers: [OrganizationsController],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
