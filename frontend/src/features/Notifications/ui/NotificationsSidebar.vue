<script lang="ts" setup>
import TooltipIcon from "@/shared/ui/TooltipIcon";
import "../style.scss";
import { MailCheckIcon, MailWarningIcon } from "lucide-vue-next";
import { computed } from "vue";
import type { INotification } from "@/entities/NotificationEntity/interface/INotification";
import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";

const props = defineProps<{
  store: any
}>();

const authorizedUserStore = useAuthorizedUserStore();

const userNotifications = computed<INotification[]>(() => {
  const userId = authorizedUserStore.user?.id;
  if (!userId) return [];

  return props.store.notifications.filter(
    (n: INotification) => n.userId === userId
  );
});
</script>

<template>
  <div class="notificationsSidebar">
    <h1 v-if="userNotifications.length > 0" class="notificationsSidebar__message--title">Уведомления</h1>
    <ul class="notificationsSidebar__list">
      <li
        v-if="userNotifications.length > 0"
        class="notificationsSidebar__notification"
        v-for="n in userNotifications"
        :key="n.id"
        :class="{ unread: !n.read }"
      >
        <div class="notificationsSidebar__textContent">
          <TooltipIcon 
            tooltip-position="notificationStatusIcon--position" 
            class="notificationStatusIcon notificationStatusIcon--warning" 
            v-if="!n.read" 
            tooltip-text="Новое уведомление"
          >
            <template #icon>
              <MailWarningIcon />
            </template>
          </TooltipIcon>
          <TooltipIcon 
            tooltip-position="notificationStatusIcon--position" 
            class="notificationStatusIcon notificationStatusIcon--check" 
            v-else tooltip-text="Новое уведомление"
          >
            <template #icon>
              <MailCheckIcon />
            </template>
          </TooltipIcon>
          <div class="notificationsSidebar__message">
            {{ n.message }}
          </div>
        </div>
        
        <div class="notificationsSidebar__bottomContent">
          <small class="notificationsSidebar__message">
            {{ new Date(n.timestamp).toLocaleTimeString() }}
          </small>
          
          <button
            class="notificationsSidebar__button"
            @click="props.store.markAsRead(n?.id)"
            v-if="userNotifications.length > 0"
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
      class="notificationsSidebar__button"
      @click="props.store.markAllAsRead()"
      v-if="userNotifications.length > 0"
    >
      Прочитать все
    </button>
  </div>
</template>
