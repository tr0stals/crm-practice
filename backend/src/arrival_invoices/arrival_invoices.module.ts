import { Module } from '@nestjs/common';
import { ArrivalInvoicesController } from './arrival_invoices.controller';
import { ArrivalInvoicesService } from './arrival_invoices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArrivalInvoices } from './arrival_invoices.entity';
import { InvoicesComponents } from '../invoices_components/invoices_components.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import { ComponentQuantityWatcherModule } from 'src/features/component-quantity-watcher/component-quantity-watcher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArrivalInvoices,
      InvoicesComponents,
      Organizations,
    ]),
    ComponentQuantityWatcherModule,
  ],
  controllers: [ArrivalInvoicesController],
  providers: [ArrivalInvoicesService],
  exports: [ArrivalInvoicesService],
})
export class ArrivalInvoicesModule {}
