<script setup lang="ts">
import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { ref, watch } from "vue";
import { useToast } from "vue-toastification";
import { startCurrentTask } from "../api/startCurrentTask";
import "../style.scss";

const navigationStore = useNavigationStore();
const authoriedUserStore = useAuthorizedUserStore();

const props = defineProps<{
  onSuccessCallback: () => void;
}>();

const toast = useToast();

const employeeId = ref<number>();

watch(
  () => authoriedUserStore.user,
  (newVal) => {
    employeeId.value = newVal.employeeData?.id;
  }
);

const handleClick = async (e: any) => {
  const currentTask = navigationStore.selectedRow;

  if (!currentTask) {
    toast.info("Не выбрана задача!");
    return;
  }
  if (currentTask.data.nodeType !== "current_tasks") {
    toast.info("Необходимо выбрать текущую задачу!");
    return;
  }

  // if (currentTask.data.currentTaskState !== "Не распределено") {
  //   alert("Невозможно взять себе эту задачу");
  //   return;
  // }

  const response = await startCurrentTask(
    currentTask.data.id,
    employeeId.value
  );
  console.debug(response.data);

  if (response.status === 400) toast.error(response.data.message);

  if (response.status === 201) props.onSuccessCallback();
};
</script>

<template>
  <Button @click="handleClick"> Взять задачу себе </Button>
</template>
