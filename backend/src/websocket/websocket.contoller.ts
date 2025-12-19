import { Controller, Get, Query } from '@nestjs/common';
import { WsGateway } from './ws.gateway';

@Controller('websocket')
export class WebsocketController {
  constructor(private readonly wsGateway: WsGateway) {}

  @Get('notify')
  notify(@Query('userId') userId: string, @Query('msg') msg: string) {
    return { ok: true };
  }
}
