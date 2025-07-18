<script setup lang="ts">
import Button from "@/shared/ui/Button/ui/Button.vue";
import { exportTable } from "../api/exportTable";
import { useGlobalStore } from "@/shared/store/globalStore";

const props = defineProps<{
  onSuccessCallback: () => void;
}>();

const globalStore = useGlobalStore();

const handleClick = async () => {
  const response = await exportTable(globalStore.currentSection, "xlsx");

  console.debug(response);
};
</script>
<template>
  <Button @click="handleClick">Экспорт таблицы</Button>
</template>
