import { Module } from '@nestjs/common';
import { OrderTypesController } from './order-types.controller';
import { OrderTypesService } from './order-types.service';

@Module({
  controllers: [OrderTypesController],
  providers: [OrderTypesService]
})
export class OrderTypesModule {}
