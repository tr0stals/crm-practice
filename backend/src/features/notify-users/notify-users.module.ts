import { Module } from '@nestjs/common';
import { NotifyUsersService } from './notify-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { NotificationUsersModule } from 'src/notification-users/notification-users.module';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { NotifyUsersController } from './notify-users.controller';

@Module({
  imports: [NotificationsModule, NotificationUsersModule, WebsocketModule],
  providers: [NotifyUsersService],
  exports: [NotifyUsersService],
  controllers: [NotifyUsersController],
})
export class NotifyUsersModule {}
