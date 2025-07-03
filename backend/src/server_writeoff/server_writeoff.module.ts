import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerWriteoff } from './server_writeoff.entity';
import { ServerWriteoffService } from './server_writeoff.service';
import { ServerWriteoffController } from './server_writeoff.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServerWriteoff])],
  providers: [ServerWriteoffService],
  controllers: [ServerWriteoffController],
  exports: [ServerWriteoffService],
})
export class ServerWriteoffModule {}
