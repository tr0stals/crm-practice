<script setup lang="ts">
import Button from "@/shared/ui/Button/ui/Button.vue";
import "../style.scss";
import DeleteIcon from "@/shared/ui/DeleteIcon/ui/DeleteIcon.vue";
import { useHandleDelete } from "../model/useHandleDelete";

const props = defineProps<{
  onUpdateCallback: () => void;
}>();
</script>
<template>
  <Button @click="useHandleDelete(props.onUpdateCallback)">
    <DeleteIcon /> удалить
  </Button>
</template>
