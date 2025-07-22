<script setup lang="ts">
import { exportDatabase } from "../api/exportDatabase";
import "../style.scss";
import Button from "@/shared/ui/Button/ui/Button.vue";

const handleExportDatabase = async () => {
  await exportDatabase();
};
</script>
<template>
  <Button @click="handleExportDatabase()">Экспорт БД</Button>
</template>
