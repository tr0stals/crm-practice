import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './notifications.entity';
import { DeepPartial, Repository } from 'typeorm';
import { NotificationsDTO } from './dto/NotificationsDTO';
import { WsGateway } from 'src/websocket/ws.gateway';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { NotificationUsersService } from 'src/notification-users/notification-users.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepo: Repository<Notifications>,

    private userService: UserService,

    private notificationUsersService: NotificationUsersService,

    private wsGateway: WsGateway,
  ) {}

  async create(data: NotificationsDTO): Promise<Notifications> {
    const entity = this.notificationsRepo.create({
      message: data.message,
      type: data.type,
      date: Date.now(),
    } as DeepPartial<Notifications>);

    return await this.notificationsRepo.save(entity);
  }

  // /**
  //  * Метод для отправки уведомлений по userId
  //  * @param userId - id пользователя
  //  * @param message - текст уведомления
  //  * @param type - тип уведомления //TODO: указать какие уведомления можно присылать
  //  */
  // public async sendNotification(userId: number, message: string, type: string) {
  //   // 1. Создаем уведомление
  //   const notification = await this.create({
  //     message: message,
  //     read: false,
  //     type: type,
  //   });

  //   await this.notificationUsersService.create({
  //     notificationId: notification.id,
  //     userId: userId,
  //   });

  //   this.wsGateway.sendNotification(
  //     userId.toString(),
  //     notification.message,
  //     notification.type,
  //   );
  // }

  // public async notifyUsers(userIds: number[], message: string, type: string) {
  //   // 1. создаём уведомление ОДИН РАЗ
  //   const notification = await this.create({
  //     message: message,
  //     type: type,
  //   });

  //   for (const userId of userIds) {
  //     // 2. создаём связи
  //     await this.notificationUsersService.create({
  //       read: false,
  //       notificationId: notification.id,
  //       userId: userId,
  //     });

  //     this.wsGateway.sendNotification(
  //       userId.toString(),
  //       notification.message,
  //       notification.type,
  //     );
  //   }
  // }
}
