<script setup lang="ts">
import type { Ref } from "vue";
import "../style.scss";

const props = defineProps<{
  store: any;
}>();
console.debug(props.store)

const notifications = props.store.notifications;
console.debug(notifications);
</script>
<template>
  <div class="notificationsMenu">
    <ul class="notificationsMenu__list">
      <li
        v-if="notifications.length > 0"
        class="notificationsMenu__list__item"
        v-for="n in notifications"
        :key="n.id"
        :class="{ unread: !n.read }"
      >
        <div class="notificationsMenu__list__item__message">
          {{ n.message }}
        </div>
        <small class="notificationsMenu__list__item__messageTime">{{
          new Date(n.timestamp).toLocaleTimeString()
        }}</small>
      </li>
      <li class="notificationsMenu__list__item" v-else>Нет уведомлений</li>
    </ul>
    <button
      class="notificationsMenu__button"
      @click="props.store.markAllAsRead()"
    >
      Прочитать все
    </button>
  </div>
</template>
