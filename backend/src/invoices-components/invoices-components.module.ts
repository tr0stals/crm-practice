import { Module } from '@nestjs/common';
import { InvoicesComponentsController } from './invoices-components.controller';
import { InvoicesComponentsService } from './invoices-components.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesComponents } from './invoices-components.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvoicesComponents])],
  controllers: [InvoicesComponentsController],
  providers: [InvoicesComponentsService],
})
export class InvoicesComponentsModule {}
