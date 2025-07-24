import { Controller, Get, Query } from '@nestjs/common';
import { WsGateway } from './ws.gateway';

@Controller('websocket')
export class WebsocketController {
  constructor(private readonly wsGateway: WsGateway) {}

  @Get('notify')
  notify(@Query('userId') userId: string, @Query('msg') msg: string) {
    this.wsGateway.sendNotification(userId, msg || 'Тестовое уведомление', 'info');
    return { ok: true };
  }
}