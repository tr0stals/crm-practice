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

const props = defineProps<{
  store: any
}>();
const refetchData = ref<() => Promise<void>>()

const authorizedUserStore = useAuthorizedUserStore();

const userNotifications = computed(() => {
  const userId = authorizedUserStore.user?.id;
  if (!userId) return [];

  return props.store.notifications
    .filter((n: any) => n.users?.id === userId)
    .map((item: any) => ({
      id: item.id, // notification_users.id
      read: item.read,
      notification: item.notifications
    }));
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
            tooltip-text="Новое уведомление"
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
            @click="!n.read && props.store.markAsReadAndSync(
              n.notification.id,
              authorizedUserStore.user!.id
            )"
          >
            Прочитано
          </button>
        </div>

      </li>
      <li 
        class="
          notificationsSidebar__message 
          notificationsSidebar__message--noNotifications
        " 
        v-else>Нет уведомлений
      </li>
    </ul>
    <button
      v-if="userNotifications.length > 0"
      class="notificationsSidebar__button"
      @click="props.store.markAllAsRead(authorizedUserStore.user?.id)"
    >
      Прочитать все
    </button>
  </div>
</template>
