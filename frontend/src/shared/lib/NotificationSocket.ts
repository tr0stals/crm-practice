// type NotificationHandler = (data: any) => void;

// export class NotificationSocket {
//   private socket: WebSocket | null = null;
//   private handlers: Set<NotificationHandler> = new Set();

//   connect(userId: number) {
//     if (this.socket) return; // уже подключены

//     this.socket = new WebSocket(`ws://localhost:3000/ws?userId=${userId}`);

//     this.socket.onopen = () => console.log("[WS] Connected");

//     this.socket.onmessage = async (event) => {
//       const data = JSON.parse(event.data);
//       if (data.event === "notifications:new") {
//         for (const handler of this.handlers) {
//           handler(data);
//         }
//       }
//     };

//     this.socket.onclose = () => {
//       console.log("[WS] Disconnected");
//       this.socket = null;
//     };
//   }

//   subscribe(handler: NotificationHandler) {
//     this.handlers.add(handler);
//   }

//   unsubscribe(handler: NotificationHandler) {
//     this.handlers.delete(handler);
//   }
// }
