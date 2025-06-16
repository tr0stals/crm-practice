<template>
  <button
    @click="printText"
    class="button"
    :class="[buttonColor, ...(extraClasses || [])]"
  >
    <component v-if="image" :is="image" class="button__icon" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import "../style.scss";

/*
 * text - текст кнопки,
 * image - иконка кнопки (необяз.),
 * buttonColor - цвет фона кнопки (по умол. серый, необяз.)
 */
const props = defineProps<{
  image?: any;
  buttonColor?: string;
  extraClasses?: string[];
}>();

const printText = () => {
  console.debug("!!!", "Кнопка нажата");
};
</script>
