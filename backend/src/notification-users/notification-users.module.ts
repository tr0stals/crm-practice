import { Module } from '@nestjs/common';
import { NotificationUsersController } from './notification-users.controller';
import { NotificationUsersService } from './notification-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationUsers } from './notification-users.entity';
import { Notifications } from 'src/notifications/notifications.entity';
import { User } from 'src/user/user.entity';
import { WebsocketModule } from 'src/websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationUsers, Notifications, User]),
    WebsocketModule,
  ],
  controllers: [NotificationUsersController],
  providers: [NotificationUsersService],
  exports: [NotificationUsersService],
})
export class NotificationUsersModule {}
