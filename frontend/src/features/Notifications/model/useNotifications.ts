import { useNotificationStore } from "@/entities/NotificationEntity/model/store";
import { onUnmounted } from "vue";
import { useToast } from "vue-toastification";

export function useNotifications(userId: string) {
  const toast = useToast();
  const store = useNotificationStore();

  const socket = new WebSocket(`ws://localhost:3000/ws?userId=${userId}`);

  socket.onmessage = (event) => {
    const { message, type } = JSON.parse(event.data);

    // 1. Показываем уведомление (авто скрытие через 3с)
    toast.info(message, { timeout: 3000 });

    // 2. Сохраняем в store
    store.addNotification({ message, type });
  };

  onUnmounted(() => {
    socket.close();
  });
}
