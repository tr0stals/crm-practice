<script lang="ts" setup>
import Button from "../../Button/ui/Button.vue";
import "../style.scss";
const props = defineProps<{
  handleClick?: () => void;
  extraClasses?: string[];
}>();

const handleExit = () => {};
</script>
<template>
  <Button :handle-click="handleClick" class="exitButton" :class="extraClasses && [...(props.extraClasses || [])]">
    Выйти
  </Button>
</template>
