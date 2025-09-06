import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PcbsController } from './pcbs.controller';
import { PcbsService } from './pcbs.service';
import { PCBS } from './pcbs.entity';
import { ComponentsModule } from 'src/components/components.module';
import { StandsModule } from 'src/stands/stands.module';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PCBS, User]), ComponentsModule, StandsModule, WebsocketModule],
  controllers: [PcbsController],
  providers: [PcbsService],
  exports: [PcbsService],
})
export class PcbsModule {}
