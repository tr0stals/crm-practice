<script setup lang="ts">
import { watch } from "vue";
import { useNotifications } from "@/features/Notifications/model/useNotifications";
import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";

const authorizedUserStore = useAuthorizedUserStore();

watch(
  () => authorizedUserStore.user?.id,
  (userId) => {
    if (userId) {
      useNotifications(userId);
    }
  },
  { immediate: true }
);
</script>

<template>
  <slot />
</template>
