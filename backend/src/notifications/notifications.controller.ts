import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsDTO } from './dto/NotificationsDTO';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('get')
  async get() {}

  @Post('create')
  async create(@Body() data: NotificationsDTO) {
    return await this.notificationsService.create(data);
  }
}
