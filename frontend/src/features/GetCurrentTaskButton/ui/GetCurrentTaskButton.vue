<script setup lang="ts">
import { useGlobalStore } from "@/shared/store/globalStore";
import "../style.scss";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { startCurrentTask } from "../api/startCurrentTask";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";
import { ref, watch } from "vue";

const navigationStore = useNavigationStore();
const authoriedUserStore = useAuthorizedUserStore();

const props = defineProps<{
  onSuccessCallback: () => void;
}>();

const employeeId = ref<number>();


watch(() => authoriedUserStore.user, (newVal) => {
  employeeId.value = newVal.employeeData?.id;
})

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

  // if (currentTask.data.currentTaskState !== "Не распределено") {
  //   alert("Невозможно взять себе эту задачу");
  //   return;
  // }

  const response = await startCurrentTask(currentTask.data.id, employeeId.value);
  console.debug(response.data);

  if (response.status === 201) props.onSuccessCallback();
};
</script>

<template>
  <Button @click="handleClick"> Взять задачу себе </Button>
</template>
