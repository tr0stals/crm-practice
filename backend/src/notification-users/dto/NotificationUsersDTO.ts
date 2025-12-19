import { IsOptional } from 'class-validator';

export class NotificationUsersDTO {
  @IsOptional()
  read: boolean;

  @IsOptional()
  notificationId: number;

  @IsOptional()
  userId: number;
}
