import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

@WebSocketGateway({ path: '/ws', cors: true, transport: 'ws' })
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // userId -> Set<WebSocket>
  private userClients: Map<string, Set<WebSocket>> = new Map();
  // userId -> Array<{message, type}>
  private pendingNotifications: Map<string, Array<{message: string, type: string}>> = new Map();
  // Антидубликат: userId -> (key -> lastSentMs). key = `${type}:${message}`
  private recentSent: Map<string, Map<string, number>> = new Map();

  private shouldSend(userId: string, message: string, type: string): boolean {
    const key = `${type}:${message}`;
    const now = Date.now();
    const windowMs = 1500; // 1.5 сек окно подавления дублей
    if (!this.recentSent.has(userId)) this.recentSent.set(userId, new Map());
    const userMap = this.recentSent.get(userId)!;
    const last = userMap.get(key) || 0;
    if (now - last < windowMs) {
      return false;
    }
    userMap.set(key, now);
    // Ленивая очистка старыx записей
    if (userMap.size > 100) {
      for (const [k, ts] of userMap.entries()) {
        if (now - ts > 60_000) userMap.delete(k);
      }
    }
    return true;
  }

  handleConnection(client: WebSocket, req: any) {
    const userId = new URL(req.url, `http://${req.headers.host}`).searchParams.get('userId');
    (client as any).userId = userId;
    console.log(`[WS] handleConnection userId=${userId}`);
    if (userId) {
      if (!this.userClients.has(userId)) this.userClients.set(userId, new Set());
      this.userClients.get(userId)!.add(client);
      console.log(`[WS] Подключился userId=${userId}. connections=${this.userClients.get(userId)!.size}`);
      // После подключения отправляем все накопленные уведомления
      if (this.pendingNotifications.has(userId)) {
        for (const notif of this.pendingNotifications.get(userId)!) {
          client.send(JSON.stringify(notif));
          console.log(`[WS] Delivered pending to userId=${userId}: ${notif.message}`);
        }
        this.pendingNotifications.delete(userId);
      }
    }
  }

  handleDisconnect(client: WebSocket) {
    const userId = (client as any).userId;
    if (userId && this.userClients.has(userId)) {
      this.userClients.get(userId)!.delete(client);
      if (this.userClients.get(userId)!.size === 0) this.userClients.delete(userId);
      console.log(`[WS] Отключился userId=${userId}`);
    }
  }

  // Отправить уведомление конкретному пользователю
  sendNotification(userId: string, message: string, type: string = 'info') {
    console.log(`[WS] sendNotification userId=${userId}, message=${message}, type=${type}`);

    if (!this.shouldSend(userId, message, type)) {
      console.log(`[WS] Skip duplicate for userId=${userId}`);
      return;
    }

    const clients = this.userClients.get(userId);
    if (clients && clients.size > 0) {
      for (const client of clients) {
        if (client.readyState === 1) {
          client.send(JSON.stringify({ message, type }));
          console.log(`[WS] Sent to ONLINE userId=${userId}: ${message}`);
        } else {
          console.log(`[WS] Client not ready, state: ${client.readyState}`);
        }
      }
    } else {
      // Пользователь оффлайн — сохраняем уведомление в памяти
      if (!this.pendingNotifications.has(userId)) this.pendingNotifications.set(userId, []);
      this.pendingNotifications.get(userId)!.push({ message, type });
      console.log(`[WS] Saved for OFFLINE userId=${userId}: ${message}`);
    }
  }
} 