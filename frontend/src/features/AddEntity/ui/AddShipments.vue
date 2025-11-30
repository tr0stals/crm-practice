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
import { api } from "@/shared/api/axiosInstance";
import { useToast } from "vue-toastification";
import { useFormValidation } from "@/shared/plugins/validation";

const props = defineProps<{
  sectionName: string;
  onClose: () => void;
  onSuccess: () => void;
}>();

// const errors = reactive<Record<string, string>>({});
const toast = useToast();

const { formData, tableColumns, selectOptions, submit } = useAddShipments(
  props.sectionName,
  () => {
    props.onSuccess();
    props.onClose();
  }
);

const { errors, handleInput, validateForm } = useFormValidation(formData);

function isDateField(key) {
  const lower = key.toLowerCase();
  return (
    lower.includes("date") ||
    lower === "deadline" ||
    lower === "manufacturetime" ||
    lower === "start" ||
    lower === "end" ||
    lower === "timeout"
  );
}

// function getFieldValue(fieldName: string, section?: string) {
//   if (fieldExtensions.includes(fieldName)) {
//     return formData[fieldName];
//   }
//   if (section && formData[section]) {
//     return formData[section][fieldName];
//   }
//   return formData[fieldName];
// }

// function validateField(fieldName: string, section?: string) {
//   const value = getFieldValue(fieldName, section);

//   errors[fieldName] = ""; // очищаем старую ошибку

//   switch (fieldName) {
//     case "price":
//       if (!value) {
//         errors[fieldName] = "Заполните поле";
//       } else if (!/^\d+([.,]\d+)?$/.test(value)) {
//         errors[fieldName] = "Введите только цифры";
//       } else if (isNaN(Number(value))) {
//         errors[fieldName] = "Некорректное число";
//       }
//       break;

//     case "addedDate":
//     case "shipmentDate":
//     case "arrivalDate":
//       if (!value) {
//         errors[fieldName] = "Заполните поле";
//       }
//       break;

//     case "specificationImage":
//       if (!value || (Array.isArray(value) && value.length === 0)) {
//         errors[fieldName] = "Добавьте хотя бы одно изображение";
//       }
//       break;

//     case "comment":
//       if (!value) {
//         errors[fieldName] = "Заполните поле";
//       } else if (value.length > 256) {
//         errors[fieldName] = "Длина комментария не может превышать 256 символов";
//       }
//       break;

//     case "licenseId":
//     case "factoryId":
//     case "transporterId":
//     case "clientId":
//     case "standId":
//       if (!value) {
//         errors[fieldName] = "Заполните поле";
//       }
//       break;
//   }

//   return !errors[fieldName];
// }

// function validateForm() {
//   let valid = true;
//   formFields.value.forEach((field) => {
//     const section = field.section || undefined;
//     const ok = validateField(field.name, section);
//     if (!ok) valid = false;
//   });
//   return valid;
// }

// function handleInput(fieldName: string, section?: string) {
//   // Если поле ранее имело ошибку — проверим его заново при вводе
//   if (errors[fieldName]) {
//     validateField(fieldName, section);
//   }
// }

const dateFields = computed(() => tableColumns.value.filter(isDateField));
const dateModel = reactive<Record<string, any>>({});
watch(
  dateFields,
  (fields) => {
    fields.forEach((key) => {
      if (!(key in dateModel)) {
        dateModel[key] = formData[key] ? formData[key].slice(0, 10) : null;
        watch(
          () => dateModel[key],
          (val) => {
            formData[key] = val ? val : null;
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
  handleInput("specificationImage");
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
    if (!validateForm(tableColumns.value, props.sectionName)) {
      toast.error("Исправьте ошибки перед отправкой");
      return;
    }

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
          v-for="item in tableColumns"
          :key="item"
        >
          <div
            v-if="item !== 'id' && item !== 'passwordSalt'"
            class="addModalWindow__contentBlock"
          >
            <label class="addModalWindow__content__field__label" :for="item">
              {{ fieldDictionary[item] || item }}
            </label>

            <!-- parentId -->
            <template v-if="item === 'parentId'">
              <select
                v-model="formData[item]"
                :id="item"
                :name="item"
                class="addModalWindow__content__field__option"
              >
                <option :value="null">Без категории</option>
                <template
                  v-for="option in selectOptions[item]"
                  :key="option.id"
                >
                  {{ console.debug(option) }}
                  <option :value="option.id">{{ option.label }}</option>
                </template>
              </select>
            </template>

            <template v-else-if="item === 'specificationImage'">
              <div class="imageInput">
                <input
                  type="file"
                  id="iconUpload"
                  class="imageInput__input--hidden"
                  multiple
                  @change="handleFilesChange"
                />

                <div
                  v-if="formData[item] && formData[item].length"
                  class="imageInput__textContent"
                >
                  <span class="imageInput__header">Выбраны изображения:</span>
                  <ul>
                    <li
                      v-for="(file, index) in formData[item]"
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

                <label for="iconUpload" class="imageInput__uploadButton">
                  Загрузить
                </label>
              </div>
            </template>

            <!-- поля с окончанием Id -->
            <template v-else-if="item.endsWith('Id')">
              <select
                v-model="formData[item]"
                :id="item"
                :name="item"
                class="addModalWindow__content__field__option"
                :class="{ 'error-layout': errors[item] }"
                @change="handleInput(item)"
              >
                <template
                  v-for="option in selectOptions[item]"
                  :key="option.id"
                >
                  <option :value="option.id">
                    {{ option.label || option.shortName }}
                  </option>
                </template>
              </select>
            </template>

            <!-- дата -->
            <DatePicker
              v-else-if="isDateField(item)"
              v-model="dateModel[item]"
              :id="item"
              :class="{ 'error-layout': errors[item] }"
              :name="item"
              :config="{
                disabled: item === 'id',
                format: 'yyyy-MM-dd',
                hideInputIcon: true,
              }"
              placeholder="Выберите дату"
              @update:model-value="handleInput(item)"
            />

            <!-- чекбокс -->
            <input
              v-else-if="item === 'isCompleted'"
              class="addModalWindow__content__field__input"
              type="checkbox"
              v-model="formData[item]"
              :id="item"
              :name="item"
            />

            <!-- vat -->
            <template v-else-if="item === 'vat'">
              <div class="addModalWindow__content__field__inputControls">
                <Button
                  class="addModalWindow__content__field__inputControls__btn"
                  :class="{ active: formData.vat === true }"
                  @click="formData.vat = true"
                >
                  Да
                </Button>
                <Button
                  class="addModalWindow__content__field__inputControls__btn"
                  :class="{ active: formData.vat === false }"
                  @click="formData.vat = false"
                >
                  Нет
                </Button>
              </div>
            </template>

            <!-- остальное -->
            <input
              required
              class="addModalWindow__content__field__input"
              :id="item"
              :name="item"
              :value="formData[item]"
              @input="
                (e) => {
                  const val = e.target.value;
                  formData[item] = val;
                  handleInput(item);
                }
              "
              :class="{ 'error-layout': errors[item] }"
              v-else
            />
          </div>
          <p v-if="errors[sectionName ?? 'global']?.[item]" class="error-text">
            {{ errors[sectionName ?? 'global'][item] }}
          </p>
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
