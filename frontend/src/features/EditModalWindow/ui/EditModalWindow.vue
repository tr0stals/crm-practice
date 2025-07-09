<script setup lang="ts">
import type { IEdittingProps } from "@/shared/config/IEdittingProps";
import "../style.scss";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { onMounted, reactive, ref, watch } from "vue";
import { EditModalWindowModel } from "../model/EditModalWindowModel";
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { getDataAsync } from "@/shared/api/getDataAsync";
import { relationMap } from "@/shared/config/relationMap";

const data = ref<any>();
const formData = ref<any>({});
const dateModel = reactive<Record<string, any>>({});
const relatedOptions = reactive<Record<string, any[]>>({});

const props = defineProps<{
  config?: IEdittingProps;
  onApplyCallback: () => {};
}>();

const { sectionName, entityId } = props?.config;
// const { licenseTypeId, ...originalData } = props.config?.data;

function isDateField(key: any) {
  const lower = key.toLowerCase();
  return (
    lower.includes("date") ||
    lower === "start" ||
    lower === "end" ||
    lower === "timeout"
  );
}

function isObjectField(value: any) {
  return value && typeof value === "object" && !Array.isArray(value);
}

const getInputType = (key: string, value: any): string => {
  if (typeof value === "boolean") return "checkbox";
  if (typeof value === "number") return "number";
  if (isObjectField(value)) return "select";
  return "text";
};

async function loadRelatedOptions(key: string) {
  /**
   * Здесь key может быть suppliers или factory. Но они относятся к таблице organizations.
   * Следовательно, запрос по suppliers/get не улетает.
   */

  try {
    const response = await getDataAsync({
      endpoint: `${relationMap[key] ? relationMap[key] : key}/get`,
    });
    relatedOptions[key] = response?.data ?? [];
    console.debug(relatedOptions);
  } catch (error) {
    console.error(`Не удалось загрузить справочник для ${key}`, error);
    relatedOptions[key] = [];
  }
}

onMounted(async () => {
  new EditModalWindowModel(props.onApplyCallback);

  // получаем конкретную запись по ID
  const response = await getDataAsync({
    endpoint: `${sectionName}/get/${entityId}`,
  });
  console.debug(response.data);

  data.value = response.data;
  formData.value = { ...response.data };

  // Поиск полей с датами
  const dateFields = Object.keys(formData.value).filter(isDateField);
  dateFields.forEach((key) => {
    dateModel[key] = formData.value[key]
      ? formData.value[key].slice(0, 10)
      : null;
    watch(
      () => dateModel[key],
      (val) => {
        formData.value[key] = val || null;
      }
    );
  });

  // Поиск полей-объектов (foreign keys)
  const objectFields = Object.entries(formData.value).filter(([, value]) =>
    isObjectField(value)
  );

  for (const [key] of objectFields) {
    await loadRelatedOptions(key);
  }
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
        <label class="editModalWindow__content__field__label" :for="key">
          {{ fieldDictionary[key] || key }}
        </label>

        <!-- Date -->
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

        <!-- Select for object (relation) -->
        <select
          v-else-if="isObjectField(value)"
          class="editModalWindow__content__field__input"
          :id="key"
          :name="key"
          :value="formData[key]?.id"
          @change="
            (e: any) => {
              const selected = relatedOptions[key]?.find(
                (item: any) => item.id === Number(e.target.value)
              );
              formData[key] = selected || null;
            }
          "
        >
          <option value="">Не выбрано</option>
          <option
            v-for="item in relatedOptions[key]"
            :key="item.id"
            :value="item.id"
          >
            {{ item.shortName || "" }}
            {{ item.lastName || "" }} {{ item.firstName || "" }}
            {{ item.middleName || "" }}
            {{
              !item.firstName && !item.lastName
                ? item.name || item.title || "Без названия"
                : ""
            }}
          </option>
        </select>

        <!-- Phone mask -->
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

        <!-- Generic input -->
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
