import { useNotificationStore } from "@/entities/NotificationEntity/model/store";
import { api } from "@/shared/api/axiosInstance";

export async function markNotificationAsRead(
  notificationId: number,
  userId: number
) {
  const store = useNotificationStore();

  // 1. optimistic update (UI сразу реагирует)
  store.markAsRead(notificationId);

  try {
    // 2. синхронизация с сервером
    await api.post(`/notification_users/read/${notificationId}/${userId}`);
  } catch (error) {
    // 3. rollback (опционально)
    console.error("Не удалось отметить уведомление как прочитанное", error);
  }
}
