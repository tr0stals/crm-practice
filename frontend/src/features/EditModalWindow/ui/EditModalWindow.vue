<script setup lang="ts">
import type { IEdittingProps } from "@/shared/config/IEdittingProps";
import "../style.scss";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
const props = defineProps<{
  config: IEdittingProps;
}>();
console.debug(props.config);
</script>
<template>
  <div class="editModalWindow">
    <component
      class="editModalWindow__closeIcon"
      id="closeIcon"
      :is="CloseIcon"
    />
    <div class="editModalWindow__header">
      <h1 class="editModalWindow__header__title">[Operation]</h1>
      <hr class="editModalWindow__header__hr" />
    </div>

    <div class="editModalWindow__content">
      <div class="editModalWindow__content__field">
        <label class="editModalWindow__content__field__label" for="field1">
          Лицензия
        </label>
        <input
          class="editModalWindow__content__field__input"
          type="text"
          name="field1"
          id="field1"
        />
      </div>
    </div>
  </div>
</template>
