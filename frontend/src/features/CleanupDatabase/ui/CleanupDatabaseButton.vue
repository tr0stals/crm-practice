<script setup lang="ts">
import Button from "@/shared/ui/Button/ui/Button.vue";
import "../style.scss";
import { useCleanupDatabase } from "../model/useCleanupDatabase";

const { confirmReset, loading } = useCleanupDatabase(); // вызываем хук и получаем функцию
</script>

<template>
  <Button class="cleanupDatabase" :handle-click="confirmReset" >
    Очистить БД
  </Button>
</template>
