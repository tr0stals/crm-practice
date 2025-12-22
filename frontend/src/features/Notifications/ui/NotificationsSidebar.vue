<script lang="ts" setup>
import TooltipIcon from "@/shared/ui/TooltipIcon";
import "../style.scss";
import { MailCheckIcon, MailWarningIcon } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import type { INotification } from "@/entities/NotificationEntity/interface/INotification";
import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";
import { markNotificationAsRead } from "../model/markNotificationAsRead";
import { api, defaultEndpoint } from "@/shared/api/axiosInstance";
import useFetch from "@/shared/lib/useFetch";
import { handleMarkAsRead } from "../model/handleMarkAsRead";
import { useNotificationStore } from "@/entities/NotificationEntity/model/store";

const store = useNotificationStore()

const authorizedUserStore = useAuthorizedUserStore();

const userNotifications = computed(() => {
  const userId = authorizedUserStore.user?.id;
  if (!userId) return [];

  return store.notifications
    .filter((n: any) => n.users?.id === userId)
    .map((item: any) => ({
      id: item.id, // notification_users.id
      read: item.read,
      notification: item.notifications
    }))
    .sort((a, b) => {
      return new Date(b.notification?.createdAt).getTime() - new Date(a.notification?.createdAt).getTime()
    }).sort((a, b) => {
      // если a.read false, b.read true → a выше
      return Number(a.read) - Number(b.read);
    });
});
</script>

<template>
  <div class="notificationsSidebar">
    <h1 v-if="userNotifications.length > 0" class="notificationsSidebar__message--title">Уведомления</h1>
    <ul class="notificationsSidebar__list">
      <li
        v-if="userNotifications.length > 0"
        v-for="n in userNotifications"
        class="notificationsSidebar__notification"
        :key="n.id"
        :class="{ unread: !n.read }"
      >
        <div class="notificationsSidebar__textContent">
          <TooltipIcon 
            v-if="!n.read" 
            tooltip-position="notificationStatusIcon--position" 
            class="notificationStatusIcon notificationStatusIcon--warning" 
            tooltip-text="Не прочитано"
          >
            <template #icon>
              <MailWarningIcon />
            </template>
          </TooltipIcon>
          <TooltipIcon 
            v-else 
            tooltip-position="notificationStatusIcon--position" 
            class="notificationStatusIcon notificationStatusIcon--check" 
            tooltip-text="Прочитано"
          >
            <template #icon>
              <MailCheckIcon />
            </template>
          </TooltipIcon>
          <div class="notificationsSidebar__message">
            {{ n.notification.message }}
          </div>
        </div>
        
        <div class="notificationsSidebar__bottomContent">
          <small class="notificationsSidebar__message">
            {{ new Date(n.notification.updatedAt).toLocaleDateString() }}
          </small>
          
          <button
            v-if="userNotifications.length > 0"
            :disabled="n.read"
            class="notificationsSidebar__button"
            :class="n.read && 'notificationsSidebar__button--disabled'"
            @click="!n.read && store.markAsReadAndSync(
              n.notification.id,
              authorizedUserStore.user!.id
            )"
          >
            {{ n.read ? "Прочитано" : "Прочитать" }}
          </button>
        </div>
      </li>
      <li 
        v-else
        class="
          notificationsSidebar__message 
          notificationsSidebar__message--noNotifications
        " 
      >
        Нет уведомлений
      </li>
    </ul>
    <button
      v-if="userNotifications.length > 0"
      class="notificationsSidebar__button"
      @click="store.markAllAsRead(authorizedUserStore.user?.id)"
    >
      Прочитать все
    </button>
  </div>
</template>
