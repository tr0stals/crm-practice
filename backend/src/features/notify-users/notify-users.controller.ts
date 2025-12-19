import { Body, Controller, Param, Post } from '@nestjs/common';
import { NotifyUsersService } from './notify-users.service';

interface IData {
  message: string;
  type: string;
}

@Controller('notify-users')
export class NotifyUsersController {
  constructor(private readonly notifyUsersService: NotifyUsersService) {}

  @Post('create/:userId')
  async create(@Param('userId') userId: string, @Body() data: IData) {
    return await this.notifyUsersService.sendNotificationToUser(+userId, data);
  }
}
