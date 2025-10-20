import { Module } from '@nestjs/common';
import { InvoicesComponentsController } from './invoices_components.controller';
import { InvoicesComponentsService } from './invoices_components.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesComponents } from './invoices_components.entity';
import { Components } from 'src/components/components.entity';
import { ArrivalInvoices } from 'src/arrival_invoices/arrival_invoices.entity';
import { ComponentQuantityWatcherModule } from 'src/features/component-quantity-watcher/component-quantity-watcher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoicesComponents, Components, ArrivalInvoices]),
    ComponentQuantityWatcherModule,
  ],
  controllers: [InvoicesComponentsController],
  providers: [InvoicesComponentsService],
})
export class InvoicesComponentsModule {}
