import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRequestsComponents } from './order_requests_components.entity';
import { OrderRequestsComponentsService } from './order_requests_components.service';
import { OrderRequestsComponentsController } from './order_requests_components.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRequestsComponents])],
  providers: [OrderRequestsComponentsService],
  controllers: [OrderRequestsComponentsController],
  exports: [OrderRequestsComponentsService]
})
export class OrderRequestsComponentsModule {}
