<template>
  <NotificationsProvider>
    <router-view />
  </NotificationsProvider>
</template>

<script setup lang="ts">
// Глобальные настройки приложения
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import "@popperjs/core";
import "bootstrap";
import NotificationsProvider from "./providers/NotificationsProvider.vue";
</script>
