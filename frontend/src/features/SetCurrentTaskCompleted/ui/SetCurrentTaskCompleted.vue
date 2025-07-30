<script setup lang="ts">
import { useGlobalStore } from "@/shared/store/globalStore";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { setCurrentTaskCompleted } from "../api/setCurrentTaskCompleted";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";

const props = defineProps<{
  onSuccessCallback: () => void;
}>();

const navigationStore = useNavigationStore();

const handleClick = async () => {
  const currentTask = navigationStore.selectedRow;

  if (!currentTask) {
    alert("Не выбрана задача!");
    return;
  }

  if (currentTask.data.nodeType !== "current_tasks") {
    alert("Необходимо выбрать текущую задачу!");
    return;
  }

  if (currentTask.data.currentTaskState !== "Выполняется") {
    alert("Данная задача находится не в стадии выполнения");
    return;
  }

  const response = await setCurrentTaskCompleted(currentTask.data.id);

  if (response.status === 201) props.onSuccessCallback();
};
</script>

<template>
  <Button @click="handleClick">Пометить как Выполнено</Button>
</template>
