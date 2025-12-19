import { Injectable } from '@nestjs/common';
import { NotificationUsersService } from 'src/notification-users/notification-users.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { WsGateway } from 'src/websocket/ws.gateway';

@Injectable()
export class NotifyUsersService {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly notificationUsersService: NotificationUsersService,
    private readonly wsGateway: WsGateway,
  ) {}

  async sendNotificationToUsers(
    userIds: number[],
    data: { message: string; type: string },
  ) {
    // 1. Создаём уведомление (один раз)
    const notification = await this.notificationsService.create({
      message: data.message,
      type: data.type,
    });

    // 2. Создаём связи пачкой
    await Promise.all(
      userIds.map((userId) =>
        this.notificationUsersService.create({
          userId,
          notificationId: notification.id,
          read: false,
        }),
      ),
    );

    // 3. Шлём WS сигнал
    userIds.forEach((userId) =>
      this.wsGateway.notifyUser(
        userId.toString(),
        notification.id,
        data.message,
        data.type,
      ),
    );
  }

  async sendNotificationToUser(
    userId: number,
    data: { message: string; type: string },
  ) {
    // 1. Создаём уведомление (один раз)
    const notification = await this.notificationsService.create({
      message: data.message,
      type: data.type,
    });

    // 2. Создаём связи пачкой

    this.notificationUsersService.create({
      userId,
      notificationId: notification.id,
      read: false,
    });

    // 3. Шлём WS сигнал
    this.wsGateway.notifyUser(
      userId.toString(),
      notification.id,
      data.message,
      data.type,
    );
  }
}
