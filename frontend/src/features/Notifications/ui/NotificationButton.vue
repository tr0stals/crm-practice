<script setup lang="ts">
import "../style.scss";
import { useNotificationStore } from "@/entities/NotificationEntity/model/store";
import { computed, ref, watch } from "vue";
import { useNotifications } from "../model/useNotifications";
import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";
import NotificationsMenu from "./NotificationsMenu.vue";
import NotificationIcon from "@/shared/ui/NotificationIcon/ui/NotificationIcon.vue";

const store = useNotificationStore();
const authorizedUserStore = useAuthorizedUserStore();
const open = ref<boolean>(false);
const userId = ref();
const isBadge = ref(false);

watch(
  () => authorizedUserStore.user?.id,
  (newVal) => {
    userId.value = newVal;
    console.debug(userId.value);
    useNotifications(userId.value);
  }
);

watch(
  () => store.notifications,
  (newNotifications) => {
    // Если есть хотя бы одно уведомление с read: false → показываем badge
    isBadge.value = newNotifications.some((n) => !n.read);
  },
  { deep: true } // обязательно, иначе не будет реагировать на изменение поля "read"
);
console.debug(authorizedUserStore.user);

const unreadCount = computed(() => store.unreadCount);
</script>
<template>
  <div class="notificationIcon">
    <NotificationIcon :is-badge="isBadge" @click="open = !open" />
    <NotificationsMenu v-if="open" :store="store" />
  </div>
</template>
