import { Notifications } from 'src/notifications/notifications.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notification_users')
export class NotificationUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false, nullable: true })
  read: boolean;

  @ManyToOne(() => User, (user) => user.notificationUsers)
  @JoinColumn({ name: 'userId' })
  users: User;

  @ManyToOne(
    () => Notifications,
    (notification) => notification.notificationUsers,
  )
  @JoinColumn({ name: 'notificationId' })
  notifications: Notifications;
}
