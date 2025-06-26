import { Module } from '@nestjs/common';
import { InvoicesComponentsController } from './invoices-components.controller';
import { InvoicesComponentsService } from './invoices-components.service';

@Module({
  controllers: [InvoicesComponentsController],
  providers: [InvoicesComponentsService]
})
export class InvoicesComponentsModule {}
