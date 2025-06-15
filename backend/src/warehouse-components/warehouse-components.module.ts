import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseComponents } from './warehouse-components.entity';
import { WarehouseComponentsService } from './warehouse-components.service';
import { WarehouseComponentsController } from './warehouse-components.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseComponents])],
  providers: [WarehouseComponentsService],
  controllers: [WarehouseComponentsController],
  exports: [WarehouseComponentsService]
})
export class WarehouseComponentsModule {}
