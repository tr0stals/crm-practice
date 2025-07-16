import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PcbOrders } from './pcb_orders.entity';
import { PcbOrdersService } from './pcb_orders.service';
import { PcbOrdersController } from './pcb_orders.controller';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { PcbsModule } from 'src/pcbs/pcbs.module';
import { PcbOrderStatesModule } from 'src/pcb_order_states/pcb_order_states.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PcbOrders]),
    OrganizationsModule,
    EmployeesModule,
    PcbsModule,
    PcbOrderStatesModule,
  ],
  providers: [PcbOrdersService],
  controllers: [PcbOrdersController],
  exports: [PcbOrdersService],
})
export class PcbOrdersModule {}
