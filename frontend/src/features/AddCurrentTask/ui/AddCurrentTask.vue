<script setup lang="ts">
import { useGlobalStore } from "@/shared/store/globalStore";
import "../style.scss";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { startCurrentTask } from "../api/startCurrentTask";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";

const navigationStore = useNavigationStore();

const props = defineProps<{
  onSuccessCallback: () => void;
}>();

const handleClick = async (e: any) => {
  const currentTask = navigationStore.selectedRow;
  console.debug(currentTask);

  if (!currentTask) {
    alert("Не выбрана задача!");
    return;
  }
  if (currentTask.data.nodeType !== "current_tasks") {
    alert("Необходимо выбрать текущую задачу!");
    return;
  }

  if (currentTask.data.currentTaskState !== "Новая") {
    alert("Невозможно взять себе эту задачу");
    return;
  }

  const response = await startCurrentTask(currentTask.data.id);

  if (response.status === 201) props.onSuccessCallback();
};
</script>

<template>
  <Button @click="handleClick">Взять задачу себе</Button>
</template>
