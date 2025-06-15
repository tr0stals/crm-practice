import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRequestComponents } from './order-request-components.entity';
import { OrderRequestComponentsService } from './order-request-components.service';
import { OrderRequestComponentsController } from './order-request-components.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRequestComponents])],
  providers: [OrderRequestComponentsService],
  controllers: [OrderRequestComponentsController],
  exports: [OrderRequestComponentsService]
})
export class OrderRequestComponentsModule {}
