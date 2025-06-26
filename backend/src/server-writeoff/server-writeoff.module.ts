import { Module } from '@nestjs/common';
import { ServerWriteoffController } from './server-writeoff.controller';
import { ServerWriteoffService } from './server-writeoff.service';

@Module({
  controllers: [ServerWriteoffController],
  providers: [ServerWriteoffService]
})
export class ServerWriteoffModule {}
