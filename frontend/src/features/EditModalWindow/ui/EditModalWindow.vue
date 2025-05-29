<script setup lang="ts">
import type { IEdittingProps } from "@/shared/config/IEdittingProps";
import "../style.scss";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { onMounted, reactive } from "vue";
import { EditModalWindowModel } from "../model/EditModalWindowModel";
const props = defineProps<{
  config: IEdittingProps;
}>();
const originalData = props.config.data[0];
const formData = reactive({ ...originalData });

console.debug("formData:", formData.target);

const getInputType = (key: string, value: any): string => {
  if (key.toLowerCase().includes("date")) return "date";
  if (typeof value === "boolean") return "checkbox";
  if (typeof value === "number") return "number";
  return "text";
};

onMounted(() => {
  new EditModalWindowModel();
});

console.debug(originalData);
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
        v-for="(value, key) in formData"
        :key="key"
        class="editModalWindow__content__field"
      >
        <label class="editModalWindow__content__field__label" :for="key">
          {{ key }}
        </label>
        <input
          class="editModalWindow__content__field__input"
          type="text"
          :id="key"
          :name="key"
          v-model="formData[key]"
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
        :data-js-save-btn="JSON.stringify(formData)"
        text="Сохранить"
        button-color="button__buttonBlue"
        :extra-classes="['editModalWindow__controls__btn']"
      />
    </div>
  </div>
</template>
