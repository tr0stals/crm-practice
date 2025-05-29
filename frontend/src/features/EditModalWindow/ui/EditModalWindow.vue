<script setup lang="ts">
import type { IEdittingProps } from "@/shared/config/IEdittingProps";
import "../style.scss";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { onMounted } from "vue";
import { EditModalWindowModel } from "../model/EditModalWindowModel";
const props = defineProps<{
  config: IEdittingProps;
}>();
const data = props.config.data[0];

const getInputType = (key: string, value: any): string => {
  if (key.toLowerCase().includes("date")) return "date";
  if (typeof value === "boolean") return "checkbox";
  if (typeof value === "number") return "number";
  return "text";
};

onMounted(() => {
  console.debug("!!!");
  new EditModalWindowModel();
});

console.debug(data);
</script>
<template>
  <div class="editModalWindow">
    <component
      class="editModalWindow__closeIcon"
      id="closeIcon"
      :is="CloseIcon"
    />
    <div class="editModalWindow__header">
      <h1 class="editModalWindow__header__title">
        {{ props.config.sectionName || "[Operation]" }}
      </h1>
      <hr class="editModalWindow__header__hr" />
    </div>

    <div class="editModalWindow__content">
      <div
        v-for="([key, value], index) in Object.entries(data)"
        :key="index"
        class="editModalWindow__content__field"
      >
        <label
          class="editModalWindow__content__field__label"
          :for="'field' + index"
        >
          {{ key }}
        </label>

        <input
          v-if="getInputType(key, value) !== 'checkbox'"
          class="editModalWindow__content__field__input"
          :type="getInputType(key, value)"
          :name="'field' + index"
          :id="'field' + index"
          :disabled="key === 'id'"
          :value="value"
        />

        <input
          v-else
          type="checkbox"
          class="editModalWindow__content__field__input"
          :name="'field' + index"
          :id="'field' + index"
          :disabled="key === 'id'"
          :checked="value"
        />
      </div>
    </div>
    <div class="editModalWindow__controls">
      <Button
        data-js-cancel-btn=""
        text="Отменить"
        button-color="button__buttonBlue"
        :extra-classes="['editModalWindow__controls__btn']"
      />
      <Button
        data-js-save-btn=""
        text="Сохранить"
        button-color="button__buttonBlue"
        :extra-classes="['editModalWindow__controls__btn']"
      />
    </div>
  </div>
</template>
