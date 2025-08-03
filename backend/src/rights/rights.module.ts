import { Module } from '@nestjs/common';
import { RightsController } from './rights.controller';
import { RightsService } from './rights.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rights } from './rights.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rights])],
  controllers: [RightsController],
  providers: [RightsService],
  exports: [RightsService],
})
export class RightsModule {}
