import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { INotification } from "../interface/INotification";

export const useNotificationStore = defineStore("notificationStore", () => {
  const notifications = ref<INotification[]>([]);

  function addNotification(data: { message: string; type: string }) {
    notifications.value.unshift({
      id: crypto.randomUUID(),
      message: data.message,
      type: data.type,
      read: false,
      timestamp: Date.now(),
    });
  }

  function markAsRead(id: string) {
    const notif = notifications.value.find((n) => n.id === id);
    if (notif) notif.read = true;
  }

  function markAllAsRead() {
    notifications.value.forEach((n) => {
      n.read = true;
    });
  }

  const unreadCount = computed(() => {
    return notifications.value.filter((n) => !n.read).length;
  });

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    unreadCount,
  };
});
