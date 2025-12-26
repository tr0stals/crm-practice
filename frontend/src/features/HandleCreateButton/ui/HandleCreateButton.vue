<script setup lang="ts">
import Button from "@/shared/ui/Button/ui/Button.vue";
import "../style.scss";
import PlusIcon from "@/shared/ui/PlusIcon/ui/PlusIcon.vue";
import { useCreateButton } from "../model/useHandleCreate";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { onMounted, ref } from "vue";
import { animate } from "animejs"

const props = defineProps<{
  onSuccessCallback: () => void;
}>();
const button = ref();

const navigationStore = useNavigationStore();

</script>
<template>
  <Button
    ref="button"
    id="createButton"
    :disabled="navigationStore.currentSection === 'current_tasks'"
    :class="
      navigationStore.currentSection === 'current_tasks' && `button--disabled`
    "
    @click="useCreateButton(props.onSuccessCallback)"
  >
    <PlusIcon /> добавить
  </Button>
</template>
