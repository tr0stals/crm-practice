import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRequestsComponents } from './order-requests-components.entity';
import { OrderRequestsComponentsService } from './order-requests-components.service';
import { OrderRequestsComponentsController } from './order-requests-components.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRequestsComponents])],
  providers: [OrderRequestsComponentsService],
  controllers: [OrderRequestsComponentsController],
  exports: [OrderRequestsComponentsService]
})
export class OrderRequestComponentsModule {}
