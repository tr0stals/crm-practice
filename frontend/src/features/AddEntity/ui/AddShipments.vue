<script setup lang="ts">
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import Button from "@/shared/ui/Button/ui/Button.vue";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import "../style.scss";
import "@vuepic/vue-datepicker/dist/main.css";
import { localizatedSectionsList } from "@/shared/config/localizatedSections";
import { computed, reactive, watch } from "vue";
import { useAddShipments } from "../model/useAddShipments";
import DatePicker from "@/shared/ui/DatePicker/ui/DatePicker.vue";

const props = defineProps<{
  sectionName: string;
  onClose: () => void;
  onSuccess: () => void;
}>();

const { formData, formFields, selectOptions, submit } = useAddShipments(
  props.sectionName,
  () => {
    props.onSuccess();
    props.onClose();
  }
);

function isDateField(key) {
  const lower = key.name.toLowerCase();
  return (
    lower.includes("date") ||
    lower === "deadline" ||
    lower === "manufacturetime" ||
    lower === "start" ||
    lower === "end" ||
    lower === "timeout"
  );
}

const dateFields = computed(() => formFields.value.filter(isDateField));
const dateModel = reactive<Record<string, any>>({});
watch(
  dateFields,
  (fields) => {
    fields.forEach((key) => {
      if (!(key.name in dateModel)) {
        dateModel[key.name] = formData[key.name]
          ? formData[key.name].slice(0, 10)
          : null;
        watch(
          () => dateModel[key.name],
          (val) => {
            formData[key.name] = val ? val : null;
          }
        );
      }
    });
  },
  { immediate: true }
);

// --- Новые функции для работы с изображениями ---
function handleFilesChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const files = Array.from(input.files || []);

  if (!formData["specificationImage"]) {
    formData["specificationImage"] = [];
  }

  // Добавляем новые файлы к существующим
  formData["specificationImage"] = [
    ...formData["specificationImage"],
    ...files,
  ];

  console.debug(formData);
}

function removeFile(index: number) {
  if (formData["specificationImage"]) {
    formData["specificationImage"].splice(index, 1);
  }
}

async function uploadImage(file: File, relatedItemId: number) {
  const data = new FormData();
  data.append("file", file);
  data.append("targetType", props.sectionName); // "organization_types" или "components"
  data.append("targetId", String(relatedItemId));

  return await api.post("/images/upload", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

const handleSubmit = async () => {
  try {
    console.debug(formData);
    await submit();
  } catch (e) {
    console.error("Ошибка при добавлении", e);
  }
};
</script>

<template>
  <div>
    <div class="modalWindow__overlay" @click="props.onClose"></div>
    <div class="modalWindow addModalWindow">
      <CloseIcon class="addModalWindow__closeIcon" @click="props.onClose" />
      <h1>{{ localizatedSectionsList[props.sectionName] }}</h1>
      <div class="addModalWindow__content">
        <div
          class="addModalWindow__content__field"
          v-for="field in formFields"
          :key="field.name"
        >
          <template v-if="field.name !== 'id'">
            <label
              class="addModalWindow__content__field__label"
              :for="field.name"
              >{{ fieldDictionary[field.name] }}</label
            >
            <input
              required
              class="addModalWindow__content__field__input"
              v-if="field.type === 'input' && !field.name.includes('Date')"
              v-model="formData[field.section][field.name]"
            />
            <template v-else-if="field.name.includes('Date')">
              <DatePicker
                v-model="dateModel[field.name]"
                :id="field.name"
                :name="field.name"
                :config="{
                  disabled: field === 'id',
                  format: 'yyyy-MM-dd',
                  hideInputIcon: true,
                }"
                placeholder="Выберите дату"
              />
            </template>
            <template v-else-if="field.name === 'specificationImage'">
              <div class="imageInput">
                <!-- Инпут для загрузки файлов -->
                <input
                  type="file"
                  id="iconUpload"
                  class="imageInput__input--hidden"
                  multiple
                  @change="handleFilesChange"
                />

                <!-- Список выбранных изображений -->
                <div
                  v-if="formData[field.name] && formData[field.name].length"
                  class="imageInput__textContent"
                >
                  <span class="imageInput__header">Выбраны изображения:</span>
                  <ul>
                    <li
                      v-for="(file, index) in formData[field.name]"
                      :key="index"
                      class="imageInput__imageItem"
                    >
                      {{ file.name }}
                      <button type="button" @click="removeFile(index)">
                        X
                      </button>
                    </li>
                  </ul>
                </div>

                <!-- Кнопка загрузки -->
                <label for="iconUpload" class="imageInput__uploadButton">
                  Загрузить
                </label>
              </div>
            </template>
            <select
              class="addModalWindow__content__field__option"
              v-else
              v-model="formData[field.section][field.name]"
            >
              <option
                v-for="opt in field.options"
                :key="opt.id"
                :value="opt.id"
                required
              >
                {{ opt.label || opt.shortName }}
              </option>
            </select>
          </template>
        </div>
      </div>
      <div class="addModalWindow__controls">
        <Button
          @click="handleSubmit"
          :extra-classes="['addModalWindow__controls__btn']"
        >
          Добавить
        </Button>
        <Button
          @click="props.onClose"
          :extra-classes="['addModalWindow__controls__btn']"
        >
          Отмена
        </Button>
      </div>
    </div>
  </div>
</template>
