import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { CurrentTasksModule } from '../current_tasks/current_tasks.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { DatabaseLocalizationModule } from 'src/database_localization/database_localization.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { StandsModule } from 'src/stands/stands.module';
import { ComponentsModule } from 'src/components/components.module';
import { PcbsModule } from 'src/pcbs/pcbs.module';
import { ComponentQuantityWatcherModule } from 'src/features/component-quantity-watcher/component-quantity-watcher.module';
import { NotifyUsersModule } from 'src/features/notify-users/notify-users.module';

@Module({
  imports: [
    CurrentTasksModule,
    WebsocketModule,
    DatabaseLocalizationModule,
    EmployeesModule,
    PcbsModule,
    ComponentsModule,
    StandsModule,
    ComponentQuantityWatcherModule,
    NotifyUsersModule,
  ],
  providers: [DatabaseService],
  controllers: [DatabaseController],
  exports: [DatabaseService],
})
export class DatabaseModule {}
