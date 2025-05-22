import { Module } from '@nestjs/common';
import { RightsService } from './rights.service';
import { RightsController } from './rights.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rights } from './rights.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rights])],
  providers: [RightsService],
  controllers: [RightsController],
  exports: [RightsService],
})
export class RightsModule {}
