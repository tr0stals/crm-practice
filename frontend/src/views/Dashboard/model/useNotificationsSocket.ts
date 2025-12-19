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
    console.debug(data);

    if (data.event === "notifications:new") {
      console.log("[WS] New notifications event received");
      await store.fetchNotifications(userId);

      const latest = store.notifications[store.notifications.length - 1];

      console.debug(store.notifications);
      console.debug(latest);
      if (latest) {
        toast.success(latest.notifications.message, {
          timeout: 5000,
        });
      }
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
