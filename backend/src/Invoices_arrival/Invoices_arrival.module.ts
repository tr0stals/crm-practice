import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesArrival } from './Invoices_arrival.entity';
import { InvoicesArrivalService } from './Invoices_arrival.service';
import { InvoicesArrivalController } from './Invoices_arrival.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InvoicesArrival])],
  providers: [InvoicesArrivalService],
  controllers: [InvoicesArrivalController],
})
export class InvoicesArrivalModule {}