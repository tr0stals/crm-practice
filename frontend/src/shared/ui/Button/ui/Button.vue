<template>
  <button
    @click="props.handleClick"
    class="button"
    :class="[props.buttonColor, ...(props.extraClasses || [])]"
  >
    <component v-if="props.image" :is="props.image" class="button__icon" />
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
  handleClick?: () => void;
}>();

const printText = () => {
  console.debug("!!!", "Кнопка нажата");
};
</script>
