import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTypesController } from './order-types.controller';
import { OrderTypesService } from './order-types.service';
import { OrderTypes } from './order-types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderTypes])],
  controllers: [OrderTypesController],
  providers: [OrderTypesService]
})
export class OrderTypesModule {}
