<script lang="ts" setup>
import "../style.scss";
import Button from "@/shared/ui/Button/ui/Button.vue";

const props = defineProps<{
  onSuccessCallback: () => void;
  onDeclineCallback: () => void;
}>();
</script>
<template>
  <div class="confirmModal modalWindow">
    <h1 class="confirmModal__title">Вы действительно хотите это сделать?</h1>
    <div class="confirmModal__controls">
      <Button
        :extra-classes="['confirmModal__button']"
        @click="props.onSuccessCallback"
        >Да</Button
      >
      <Button
        :extra-classes="['confirmModal__button']"
        @click="props.onDeclineCallback"
        >Нет</Button
      >
    </div>
  </div>
</template>
