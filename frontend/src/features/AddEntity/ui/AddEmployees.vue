<script setup lang="ts">
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import Button from "@/shared/ui/Button/ui/Button.vue";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import "../style.scss";
import "@vuepic/vue-datepicker/dist/main.css";
import { localizatedSectionsList } from "@/shared/config/localizatedSections";
import { useAddEmployees } from "../model/useAddEmployees";
import { computed, reactive, watch } from "vue";
import DatePicker from "@/shared/ui/DatePicker/ui/DatePicker.vue";
import { useFormValidation } from "@/shared/plugins/validation";
import { useToast } from "vue-toastification";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import IMask from "imask";
import PhoneInput from "@/features/PhoneInput";

const phoneMaskDirective = {
  mounted(el: HTMLInputElement) {
  (el as any)._mask = IMask(el, {
    mask: '+{7}(000)000-00-00'
  });
},
unmounted(el: HTMLInputElement) {
  const mask = (el as any)._mask;
  if (mask) mask.destroy();
}

};

defineExpose({ phoneMaskDirective });

const props = defineProps<{
  sectionName: string;
  onClose: () => void;
  onSuccess: () => void;
}>();
const navigationStore = useNavigationStore()


const { formData, tableColumns, selectOptions, submit } = useAddEmployees(
  props.sectionName,
  () => {
    props.onSuccess();
    props.onClose();
  }
);
const toast = useToast();

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

const dateFields = computed(() => tableColumns.value.filter(isDateField));
const dateModel = reactive<Record<string, any>>({});
watch(
  dateFields,
  (fields) => {
    fields.forEach((key) => {
      console.debug(key);
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

const handleSubmit = async () => {
  try {
    console.debug("modal!!!!", props.sectionName)
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

            <!-- телефон -->
            <PhoneInput
              v-else-if="item === 'phone'"
              v-model="formData[item]"
              :id="item"
              :name="item"
              class="addModalWindow__content__field__input"
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
          id="createButton"
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
