<template>
  <button class="app-button" :type="type" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
import "../style.scss";
defineProps<{
  type?: "button" | "submit" | "reset";
}>();

defineEmits(["click"]);
</script>

<style scoped></style>
