import { Module } from '@nestjs/common';
import { OrderRequestsController } from './order-requests.controller';
import { OrderRequestsService } from './order-requests.service';

@Module({
  controllers: [OrderRequestsController],
  providers: [OrderRequestsService]
})
export class OrderRequestsModule {}
