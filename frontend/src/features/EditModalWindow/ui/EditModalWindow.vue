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
        v-for="(value, key) in formData as { [key: string]: any }"
        :key="key"
        class="editModalWindow__content__field"
      >
        <label class="editModalWindow__content__field__label" :for="String(key)">
          {{ key }}
        </label>
        <input
          class="editModalWindow__content__field__input"
          :type="getInputType(key, value)"
          :id="String(key)"
          :name="String(key)"
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

<style scoped>
.editModalWindow {
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  gap: 2rem;
  padding: 25px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);

  &__header {
    &__title {
      font-size: 2em;
      color: #333;
    }

    &__hr {
      width: 100%;
      border: none;
      height: 1px;
      background-color: #eee;
      margin: 15px 0;
    }
  }

  &__closeIcon {
    position: absolute;
    right: 15px;
    top: 15px;
    cursor: pointer;
    width: 24px;
    height: 24px;
    color: #666;
  }

  &__content {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    width: 100%;
    gap: 15px;

    &__field {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: 15px;

      &__label {
        font-weight: bold;
        color: #555;
        flex-basis: 120px;
        flex-shrink: 0;
      }

      &__input {
        flex-grow: 1;
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1em;
      }
    }
  }

  &__controls {
    display: flex;
    flex-direction: row;
    justify-content: right;
    gap: 2rem;

    &__btn {
      background-color: #f4f4f4;
      color: #0056b3;
      border: 1px solid #ddd;
      padding: 8px 15px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1em;
    }
  }
}
</style>
