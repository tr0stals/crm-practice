import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { WebsocketController } from './websocket.contoller';

@Module({
  controllers: [WebsocketController],
  providers: [WsGateway],
  exports: [WsGateway],
})
export class WebsocketModule {} 