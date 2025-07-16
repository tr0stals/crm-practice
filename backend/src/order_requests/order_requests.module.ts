import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRequests } from './order_requests.entity';
import { OrderRequestsService } from './order_requests.service';
import { OrderRequestsController } from './order_requests.controller';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { StandsModule } from 'src/stands/stands.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRequests]),
    OrganizationsModule,
    EmployeesModule,
    StandsModule,
  ],
  providers: [OrderRequestsService],
  controllers: [OrderRequestsController],
  exports: [OrderRequestsService],
})
export class OrderRequestsModule {}
