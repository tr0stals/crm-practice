import { Module } from '@nestjs/common';
import { InvoicesComponentsController } from './invoices_components.controller';
import { InvoicesComponentsService } from './invoices_components.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesComponents } from './invoices_components.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvoicesComponents])],
  controllers: [InvoicesComponentsController],
  providers: [InvoicesComponentsService],
})
export class InvoicesComponentsModule {}
