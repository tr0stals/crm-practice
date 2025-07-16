import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRequestsComponents } from './order_requests_components.entity';
import { OrderRequestsComponentsService } from './order_requests_components.service';
import { OrderRequestsComponentsController } from './order_requests_components.controller';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { ComponentsModule } from 'src/components/components.module';
import { OrderRequestsModule } from 'src/order_requests/order_requests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRequestsComponents]),
    OrganizationsModule,
    ComponentsModule,
    OrderRequestsModule,
  ],
  providers: [OrderRequestsComponentsService],
  controllers: [OrderRequestsComponentsController],
  exports: [OrderRequestsComponentsService],
})
export class OrderRequestsComponentsModule {}
