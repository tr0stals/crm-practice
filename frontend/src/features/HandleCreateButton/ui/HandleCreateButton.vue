<script setup lang="ts">
import Button from "@/shared/ui/Button/ui/Button.vue";
import "../style.scss";
import PlusIcon from "@/shared/ui/PlusIcon/ui/PlusIcon.vue";
import { useCreateButton } from "../model/useHandleCreate";

const props = defineProps<{
  onSuccessCallback: () => void;
}>();
</script>
<template>
  <Button @click="useCreateButton(props.onSuccessCallback)">
    <PlusIcon /> добавить
  </Button>
</template>
