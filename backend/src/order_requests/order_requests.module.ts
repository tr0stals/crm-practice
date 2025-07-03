import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRequests } from './order_requests.entity';
import { OrderRequestsService } from './order_requests.service';
import { OrderRequestsController } from './order_requests.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRequests])],
  providers: [OrderRequestsService],
  controllers: [OrderRequestsController],
  exports: [OrderRequestsService]
})
export class OrderRequestsModule {}
