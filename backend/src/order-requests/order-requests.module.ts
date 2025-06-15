import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRequests } from './order-requests.entity';
import { OrderRequestsService } from './order-requests.service';
import { OrderRequestsController } from './order-requests.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRequests])],
  providers: [OrderRequestsService],
  controllers: [OrderRequestsController],
  exports: [OrderRequestsService]
})
export class OrderRequestsModule {}
