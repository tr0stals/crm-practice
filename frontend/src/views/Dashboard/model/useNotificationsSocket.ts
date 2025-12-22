import { useNotificationStore } from "@/entities/NotificationEntity/model/store";
import { ref, onUnmounted } from "vue";
import { useToast } from "vue-toastification";

let socket: WebSocket | null = null;

export function useNotificationsSocket(userId: number) {
  const store = useNotificationStore();
  const toast = useToast();

  if (socket) return; // не создаём повторно

  socket = new WebSocket(`ws://localhost:3000/ws?userId=${userId}`);

  socket.onopen = () => {
    console.log("[WS] Connected");
  };

  socket.onmessage = async (event) => {
    const data = JSON.parse(event.data);

    if (data.event === "notifications:new") {
      const { notification } = data;

      toast[notification.type ?? "info"](notification.message, {
        timeout: 5000,
      });

      store.fetchNotifications(userId);
    }
  };

  socket.onclose = () => {
    console.log("[WS] Disconnected");
    socket = null;
  };

  // Опционально: закрыть WS при размонтировании
  onUnmounted(() => {
    socket?.close();
    socket = null;
  });
}
