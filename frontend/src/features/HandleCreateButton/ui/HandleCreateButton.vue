<script setup lang="ts">
import Button from "@/shared/ui/Button/ui/Button.vue";
import "../style.scss";
import PlusIcon from "@/shared/ui/PlusIcon/ui/PlusIcon.vue";
import { useCreateButton } from "../model/useHandleCreate";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";

const props = defineProps<{
  onSuccessCallback: () => void;
}>();

const navigationStore = useNavigationStore();
</script>
<template>
  <Button
    :disabled="navigationStore.currentSection === 'current_tasks'"
    :class="
      navigationStore.currentSection === 'current_tasks' && `button--disabled`
    "
    @click="useCreateButton(props.onSuccessCallback)"
  >
    <PlusIcon /> добавить
  </Button>
</template>
