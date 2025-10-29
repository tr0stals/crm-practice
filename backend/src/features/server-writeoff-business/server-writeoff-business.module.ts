import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerWriteoffBusinessService } from './server-writeoff-business.service';
import { ServerWriteoff } from 'src/server_writeoff/server_writeoff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServerWriteoff])],
  providers: [ServerWriteoffBusinessService],
  exports: [ServerWriteoffBusinessService],
})
export class ServerWriteoffBusinessModule {}