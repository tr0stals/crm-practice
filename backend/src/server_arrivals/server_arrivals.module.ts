import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerArrivals } from './server_arrivals.entity';
import { ServerArrivalsService } from './server_arrivals.service';
import { ServerArrivalsController } from './server_arrivals.controller';
import { ComponentsModule } from 'src/components/components.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { CurrentTasksModule } from 'src/current_tasks/current_tasks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServerArrivals]),
    ComponentsModule,
    OrganizationsModule,
    CurrentTasksModule,
  ],
  providers: [ServerArrivalsService],
  controllers: [ServerArrivalsController],
  exports: [ServerArrivalsService],
})
export class ServerArrivalsModule {}
