<template>
  <button
    @click="printText"
    class="button"
    :class="[buttonColor, ...(extraClasses || [])]"
  >
    <component v-if="image" :is="image" class="button__icon" />
    {{ text }}
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
  text: string;
  image?: any;
  buttonColor?: string;
  extraClasses?: string[];
}>();

const printText = () => {
  console.debug("!!!", props.text);
};
</script>
