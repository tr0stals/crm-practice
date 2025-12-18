<script setup lang="ts">
import { useGlobalStore } from "@/shared/store/globalStore";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { setCurrentTaskCompleted } from "../api/setCurrentTaskCompleted";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { useToast } from "vue-toastification";
import { useNotificationStore } from "@/entities/NotificationEntity/model/store";
import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";

const props = defineProps<{
  onSuccessCallback: () => void;
}>();

const toast = useToast();

const navigationStore = useNavigationStore();
const notificationStore = useNotificationStore();
const authorizedUserStore = useAuthorizedUserStore();

const handleClick = async () => {
  const currentTask = navigationStore.selectedRow;

  if (!currentTask) {
    notificationStore.addNotification({
      message: "Не выбрана задача",
      type: "info",
      userId: authorizedUserStore.user?.id
    })
    toast.info("Не выбрана задача!");
    return;
  }

  if (currentTask.data.nodeType !== "current_tasks") {
    toast.info("Необходимо выбрать текущую задачу!");
    return;
  }

  if (currentTask.data.currentTaskState !== "Выполняется") {
    toast.info("Данная задача находится не в стадии выполнения");
    return;
  }

  const response = await setCurrentTaskCompleted(currentTask.data.id);

  if (response.status === 400) {
    toast.error(response.data.message);
  }

  if (response.status === 201) {
    notificationStore.addNotification({
      message: `Задача ${currentTask.data.taskTitle.toLowerCase()}: выполнена`,
      type: "success",
      userId: authorizedUserStore.user?.id
    });
    toast.success(`Задача ${currentTask.data.taskTitle.toLowerCase()} выполнена`);
    props.onSuccessCallback();
  }
};
</script>

<template>
  <Button @click="handleClick">Пометить как Завершена</Button>
</template>
