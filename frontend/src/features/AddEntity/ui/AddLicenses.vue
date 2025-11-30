<script setup lang="ts">
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import Button from "@/shared/ui/Button/ui/Button.vue";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import "../style.scss";
import { reactive, watch, computed } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import { localizatedSectionsList } from "@/shared/config/localizatedSections";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { useAddLicenses } from "../model/useAddLicenses";
import DatePicker from "@/shared/ui/DatePicker/ui/DatePicker.vue";
import { useFormValidation } from "@/shared/plugins/validation";
import { useToast } from "vue-toastification";

const props = defineProps<{
  sectionName: string;
  onClose: () => void;
  onSuccess: () => void;
}>();
const navigationStore = useNavigationStore();
const toast = useToast();

const { formData, tableColumns, selectOptions, submit } = useAddLicenses(
  props.sectionName,
  () => {
    props.onSuccess();
    props.onClose();
  }
);

const { errors, handleInput, validateForm } = useFormValidation(formData);

function isDateField(key: any) {
  console.debug(key);
  const lower = key.toLowerCase();
  return (
    lower.includes("date") ||
    lower === "deadline" ||
    lower === "manufacturetime" ||
    lower === "start" ||
    lower === "end"
  );
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
    if (!validateForm(tableColumns.value, props.sectionName)) {
      toast.error("Исправьте ошибки перед отправкой");
      return;
    }

    const licenseTypeId = navigationStore.selectedRow?.data.id;
    formData.licenseTypeId = licenseTypeId;

    console.debug("formData.value", formData);
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
          v-for="item in tableColumns"
          :key="item"
          class="addModalWindow__content__field"
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
                @change="handleInput(item)"
                :class="{ 'error-layout': errors[item] }"
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

            <template v-else-if="item === `timeout`">
              <input
                class="addModalWindow__content__field__input"
                type="time"
                v-model="formData[item]"
                :id="item"
                :name="item"
                :class="{ 'error-layout': errors[item] }"
                @change="handleInput(item)"
              />
            </template>

            <!-- поля с окончанием Id -->
            <template v-else-if="item.endsWith('Id')">
              <select
                v-model="formData[item]"
                :id="item"
                :name="item"
                class="addModalWindow__content__field__option"
                @change="handleInput(item)"
                :class="{ 'error-layout': errors[item] }"
              >
                <template
                  v-for="option in selectOptions[item]"
                  :key="option.id"
                >
                  <option :value="option.id">{{ option.label }}</option>
                </template>
              </select>
            </template>

            <!-- дата -->
            <DatePicker
              v-else-if="isDateField(item)"
              v-model="dateModel[item]"
              :id="item"
              :name="item"
              @update:model-value="handleInput(item)"
              :class="{ 'error-layout': errors[item] }"
              :config="{
                disabled: item === 'id',
                format: 'yyyy-MM-dd',
                hideInputIcon: true,
              }"
              placeholder="Выберите дату"
            />

            <!-- чекбокс -->
            <input
              v-else-if="item === 'isCompleted'"
              class="addModalWindow__content__field__input"
              type="checkbox"
              v-model="formData[item]"
              :id="item"
              @change="handleInput(item)"
              :name="item"
            />

            <!-- vat -->
            <template v-else-if="item === 'vat'">
              <div class="addModalWindow__content__field__inputControls">
                <Button
                  class="addModalWindow__content__field__inputControls__btn"
                  :class="{ active: formData.vat === true }"
                  @click="formData.vat = true"
                  @change="handleInput(item)"
                >
                  Да
                </Button>
                <Button
                  class="addModalWindow__content__field__inputControls__btn"
                  :class="{ active: formData.vat === false }"
                  @click="formData.vat = false"
                  @change="handleInput(item)"
                >
                  Нет
                </Button>
              </div>
            </template>

            <!-- остальное -->
            <input
              v-else
              type="text"
              class="addModalWindow__content__field__input"
              v-model="formData[item]"
              :id="item"
              :name="item"
              @change="handleInput(item)"
              :class="{ 'error-layout': errors[item] }"
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
