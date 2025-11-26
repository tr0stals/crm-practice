import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerWriteoffBusinessService } from './server-writeoff-business.service';
import { ServerWriteoff } from 'src/server_writeoff/server_writeoff.entity';
import { StandTasksComponents } from 'src/stand_tasks_components/stand_tasks_components.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServerWriteoff, StandTasksComponents])],
  providers: [ServerWriteoffBusinessService],
  exports: [ServerWriteoffBusinessService],
})
export class ServerWriteoffBusinessModule {}
