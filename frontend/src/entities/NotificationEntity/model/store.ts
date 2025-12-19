import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { INotification } from "../interface/INotification";
import { api } from "@/shared/api/axiosInstance";

const CACHE_KEY = "notifications";

export const useNotificationStore = defineStore("notificationStore", () => {
  /** STATE */
  const notifications = ref<INotification[]>([]);
  const isLoaded = ref(false);
  const isLoading = ref(false);

  /** PRIVATE */
  function saveToCache() {
    localStorage.setItem(CACHE_KEY, JSON.stringify(notifications.value));
  }

  /** ACTIONS */

  function loadFromCache() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      notifications.value = JSON.parse(cached);
    }
  }

  async function fetchNotifications(userId: number) {
    isLoading.value = true;

    try {
      const { data } = await api.get<INotification[]>(
        `/notification_users/get/${userId}`
      );

      notifications.value = data;
      isLoaded.value = true;
      saveToCache();
    } finally {
      isLoading.value = false;
    }
  }

  function addNotification(notification: INotification) {
    notifications.value.unshift(notification);
    saveToCache();
  }

  function markAsRead(notificationId: number) {
    const notif = notifications.value.find(
      (n: any) => n.notifications?.id === notificationId
    );

    if (notif) {
      notif.read = true;
      saveToCache();
    }
  }

  async function markAsReadAndSync(notificationId: number, userId: number) {
    // optimistic update
    markAsRead(notificationId);

    await api.post(`/notification_users/read/${notificationId}/${userId}`);
  }

  async function markAllAsRead(userId: number) {
    notifications.value.forEach((n: any) => (n.read = true));

    await api.post(`/notification_users/readAll/${userId}`);

    saveToCache();
  }

  /** GETTERS */

  const unreadCount = computed(
    () => notifications.value.filter((n: any) => !n.read).length
  );

  return {
    // state
    notifications,
    isLoaded,
    isLoading,

    // actions
    loadFromCache,
    fetchNotifications,
    addNotification,
    markAsRead,
    markAsReadAndSync,
    markAllAsRead,

    // getters
    unreadCount,
  };
});
