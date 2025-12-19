import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

type ClientWithUser = WebSocket & { userId?: string };

@WebSocketGateway({
  path: '/ws',
  cors: true,
  transports: ['websocket'],
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  /**
   * userId -> Set<WebSocket>
   * Один пользователь может иметь несколько подключений (вкладки)
   */
  private readonly userClients = new Map<string, Set<ClientWithUser>>();

  handleConnection(client: ClientWithUser, req: any) {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const userId = url.searchParams.get('userId');

      if (!userId) {
        client.close();
        return;
      }

      client.userId = userId;

      if (!this.userClients.has(userId)) {
        this.userClients.set(userId, new Set());
      }

      this.userClients.get(userId)!.add(client);

      console.log(
        `[WS] Connected userId=${userId}, connections=${this.userClients.get(userId)!.size}`,
      );
    } catch (e) {
      console.error('[WS] Connection error', e);
      client.close();
    }
  }

  handleDisconnect(client: ClientWithUser) {
    const userId = client.userId;
    if (!userId) return;

    const clients = this.userClients.get(userId);
    if (!clients) return;

    clients.delete(client);

    if (clients.size === 0) {
      this.userClients.delete(userId);
    }

    console.log(`[WS] Disconnected userId=${userId}`);
  }

  /**
   * Сигнал клиенту:
   * "появились новые уведомления"
   */
  notifyUser(
    userId: string,
    notificationId: number,
    message: string,
    type: string,
  ) {
    const clients = this.userClients.get(userId);
    if (!clients || clients.size === 0) return;

    const payload = JSON.stringify({
      event: 'notifications:new',
      notification: {
        id: notificationId,
        message,
        type,
      },
    });

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) client.send(payload);
    }

    console.log(
      `[WS] Notify userId=${userId} notificationId=${notificationId}`,
    );
  }
}
