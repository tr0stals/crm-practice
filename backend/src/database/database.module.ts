import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { CurrentTasksModule } from '../current_tasks/current_tasks.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { DatabaseLocalizationModule } from 'src/database_localization/database_localization.module';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [CurrentTasksModule, WebsocketModule, DatabaseLocalizationModule, EmployeesModule],
  providers: [DatabaseService],
  controllers: [DatabaseController],
  exports: [DatabaseService],
})
export class DatabaseModule {}
