import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerWriteoff } from './server-writeoff.entity';
import { ServerWriteoffService } from './server-writeoff.service';
import { ServerWriteoffController } from './server-writeoff.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServerWriteoff])],
  providers: [ServerWriteoffService],
  controllers: [ServerWriteoffController],
  exports: [ServerWriteoffService],
})
export class ServerWriteoffModule {}
