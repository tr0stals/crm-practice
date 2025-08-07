import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRequests } from './order_requests.entity';
import { OrderRequestsService } from './order_requests.service';
import { OrderRequestsController } from './order_requests.controller';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { StandsModule } from 'src/stands/stands.module';
import { OrderRequestsComponents } from 'src/order_requests_components/order_requests_components.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRequests, OrderRequestsComponents]),
    OrganizationsModule,
    EmployeesModule,
    StandsModule,
  ],
  providers: [OrderRequestsService],
  controllers: [OrderRequestsController],
  exports: [OrderRequestsService],
})
export class OrderRequestsModule {}
