import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NotificationUsers } from './notification-users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationUsersDTO } from './dto/NotificationUsersDTO';
import { Notifications } from 'src/notifications/notifications.entity';
import { User } from 'src/user/user.entity';
import { WsGateway } from 'src/websocket/ws.gateway';

@Injectable()
export class NotificationUsersService {
  constructor(
    @InjectRepository(NotificationUsers)
    private readonly notificationUsersRepo: Repository<NotificationUsers>,

    @InjectRepository(Notifications)
    private readonly notificationsRepo: Repository<Notifications>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private wsGateway: WsGateway,
  ) {}

  async get(userId: number) {
    const userNotifications = await this.notificationUsersRepo.find({
      where: {
        users: {
          id: userId,
        },
      },
      relations: ['notifications', 'users'],
    });

    return userNotifications;
  }

  async create(data: NotificationUsersDTO) {
    try {
      const notification = await this.notificationsRepo.findOne({
        where: {
          id: data.notificationId,
        },
        relations: [],
      });

      const user = await this.userRepo.findOne({
        where: {
          id: data.userId,
        },
        relations: ['employees'],
      });

      if (!user) throw new NotFoundException('Не найден пользователь');
      if (!notification) throw new NotFoundException('Не найдено уведомление');

      const entity = this.notificationUsersRepo.create({
        notifications: notification,
        users: user,
      });

      return await this.notificationUsersRepo.save(entity);
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async markAsReadAll(userId: number) {
    const result = await this.notificationUsersRepo.update(
      {
        users: { id: userId },
        read: false,
      },
      {
        read: true,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Непрочитанных уведомлений нет');
    }
  }

  async markAsRead(id: number, userId: number) {
    const entity = await this.notificationUsersRepo.findOne({
      where: {
        notifications: {
          id: id,
        },
        users: {
          id: userId,
        },
      },
      relations: ['notifications', 'users'],
    });

    if (!entity) {
      throw new NotFoundException('Notification not found');
    }

    if (entity.read) {
      return entity;
    }

    entity.read = true;

    return this.notificationUsersRepo.save(entity);
  }
}
