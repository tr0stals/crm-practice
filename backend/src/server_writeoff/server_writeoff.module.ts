import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerWriteoff } from './server_writeoff.entity';
import { ServerWriteoffService } from './server_writeoff.service';
import { ServerWriteoffController } from './server_writeoff.controller';
import { ComponentsModule } from 'src/components/components.module';
import { CurrentTasksModule } from 'src/current_tasks/current_tasks.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { ComponentQuantityWatcherModule } from 'src/features/component-quantity-watcher/component-quantity-watcher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServerWriteoff]),
    ComponentsModule,
    OrganizationsModule,
    CurrentTasksModule,
    ComponentQuantityWatcherModule,
  ],
  providers: [ServerWriteoffService],
  controllers: [ServerWriteoffController],
  exports: [ServerWriteoffService],
})
export class ServerWriteoffModule {}
