import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from './images.entity';
import { OrganizationTypes } from 'src/organization_types/organization_types.entity';
import { Components } from 'src/components/components.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Images, OrganizationTypes, Components])],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
