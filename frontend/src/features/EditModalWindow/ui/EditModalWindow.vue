<script setup lang="ts">
import type { IEdittingProps } from "@/shared/config/IEdittingProps";
import "../style.scss";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { onMounted, reactive, ref, watch } from "vue";
import { EditModalWindowModel } from "../model/EditModalWindowModel";
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const data = ref<any[]>([]);

const props = defineProps<{
  config?: IEdittingProps;
  onApplyCallback: () => {};
}>();

const { licenseTypeId, ...originalData } = props.config?.data;
const formData = reactive(originalData);
console.debug(originalData);

function isDateField(key) {
  const lower = key.toLowerCase();
  return (
    lower.includes('date') ||
    lower === 'start' ||
    lower === 'end' ||
    lower === 'timeout'
  );
}

const dateFields = Object.keys(formData).filter(isDateField);
const dateModel = reactive<Record<string, any>>({});
dateFields.forEach(key => {
  dateModel[key] = formData[key] ? formData[key].slice(0, 10) : null;
  watch(() => dateModel[key], (val) => {
    formData[key] = val ? val : null;
  });
});

const getInputType = (key: string, value: any): string => {
  if (isDateField(key)) return "date";
  if (typeof value === "boolean") return "checkbox";
  if (typeof value === "number") return "number";
  return "text";
};

onMounted(() => {
  new EditModalWindowModel(props.onApplyCallback);
});
</script>

<template>
  <div id="modalWindow" class="modalWindow editModalWindow">
    <component
      class="editModalWindow__closeIcon"
      id="closeIcon"
      :is="CloseIcon"
    />
    <div class="editModalWindow__header">
      <h1 class="editModalWindow__header__title">
        {{ props.config?.sectionName || "[Operation]" }}
      </h1>
      <hr class="editModalWindow__header__hr" />
    </div>

    <div class="editModalWindow__content">
      <div
        v-for="(value, key) in formData"
        :key="key"
        class="editModalWindow__content__field"
      >
        <label
          class="editModalWindow__content__field__label"
          :for="key"
        >
          {{ fieldDictionary[key] }}
        </label>
        <VueDatePicker
          v-if="isDateField(key)"
          v-model="dateModel[key]"
          :id="key"
          :name="key"
          :disabled="key === 'id'"
          format="yyyy-MM-dd"
          model-type="yyyy-MM-dd"
          input-class-name="editModalWindow__content__field__input"
          placeholder="Выберите дату"
          auto-apply
        />
        <input
          v-else-if="key === 'phone'"
          class="editModalWindow__content__field__input"
          :disabled="key === 'id'"
          type="text"
          v-model="formData[key]"
          :id="key"
          :name="key"
          placeholder="+7 (___) ___-__-__"
        />
        <input
          v-else
          class="editModalWindow__content__field__input"
          :disabled="key === 'id'"
          :type="getInputType(key, value)"
          :id="key"
          :name="key"
          v-model="formData[key]"
        />
      </div>
    </div>
    <div class="editModalWindow__controls">
      <Button
        data-js-cancel-btn=""
        button-color="button__buttonBlue"
        :extra-classes="['editModalWindow__controls__btn']"
      >
        Отмена
      </Button>
      <Button
        :data-js-apply-btn="
          JSON.stringify({ sectionName: props.config?.sectionName, formData })
        "
        button-color="button__buttonBlue"
        :extra-classes="['editModalWindow__controls__btn']"
      >
        Сохранить
      </Button>
    </div>
  </div>
</template>
