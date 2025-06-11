import { Module } from '@nestjs/common';
import { OrderRequestComponentsController } from './order-request-components.controller';
import { OrderRequestComponentsService } from './order-request-components.service';

@Module({
  controllers: [OrderRequestComponentsController],
  providers: [OrderRequestComponentsService]
})
export class OrderRequestComponentsModule {}
