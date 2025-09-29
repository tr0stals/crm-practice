<script setup lang="ts">
import EditIcon from "@/shared/ui/EditIcon/ui/EditIcon.vue";
import Button from "@/shared/ui/Button/ui/Button.vue";
import "../style.scss";
import { useHandleEdit } from "../model/useHandleEdit";

const props = defineProps<{
  onSuccessCallback: () => void;
}>();
</script>
<template>
  <Button @click="useHandleEdit(props.onSuccessCallback)">
    <EditIcon /> редактировать
  </Button>
</template>
