import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NotificationUsersService } from './notification-users.service';
import { NotificationUsersDTO } from './dto/NotificationUsersDTO';

@Controller('notification_users')
export class NotificationUsersController {
  constructor(
    private readonly notificationUsersService: NotificationUsersService,
  ) {}

  @Get('get/:userId')
  async get(@Param('userId') userId: string) {
    return await this.notificationUsersService.get(+userId);
  }

  @Post('create')
  async create(@Body() data: NotificationUsersDTO) {
    return await this.notificationUsersService.create(data);
  }

  @Post('read/:notificationId/:userId')
  async markAsRead(
    @Param('notificationId') id: string,
    @Param('userId') userId: string,
  ) {
    return this.notificationUsersService.markAsRead(+id, +userId);
  }

  @Post('readAll/:userId')
  async markAsReadAll(@Param('userId') userId: string) {
    return await this.notificationUsersService.markAsReadAll(+userId);
  }
}
