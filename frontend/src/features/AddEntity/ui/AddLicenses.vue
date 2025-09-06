<script setup lang="ts">
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import Button from "@/shared/ui/Button/ui/Button.vue";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import "../style.scss";
import { reactive, watch, computed } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { localizatedSectionsList } from "@/shared/config/localizatedSections";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { useAddLicenses } from "../model/useAddLicenses";
import DatePicker from "@/shared/ui/DatePicker/ui/DatePicker.vue";

const props = defineProps<{
  sectionName: string;
  onClose: () => void;
  onSuccess: () => void;
}>();
const navigationStore = useNavigationStore();

const { formData, tableColumns, selectOptions, submit } = useAddLicenses(
  props.sectionName,
  () => {
    props.onSuccess();
    props.onClose();
  }
);

function isDateField(key) {
  console.debug(key);
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
    const licenseTypeId = navigationStore.selectedRow?.data.id;
    console.debug(licenseTypeId);
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
          <template
            v-if="
              item !== 'id' &&
              item !== 'passwordSalt' &&
              item !== 'licenseTypeId'
            "
          >
            <label class="addModalWindow__content__field__label" :for="item">
              {{ fieldDictionary[item] || item }}
            </label>
            <template v-if="item.endsWith('Id')">
              <select
                v-model="formData[item]"
                :id="item"
                :name="item"
                class="addModalWindow__content__field__option"
              >
                <option value="" disabled>Выберите значение</option>
                <template
                  :key="option.id"
                  v-for="option in selectOptions[item]"
                >
                  <option :value="option.id">
                    {{ option.label }}
                  </option>
                </template>
              </select>
            </template>
            <DatePicker
              v-else-if="isDateField(item)"
              v-model="dateModel[item]"
              :id="item"
              :name="item"
              :config="{
                disabled: item === 'id',
                format: 'yyyy-MM-dd',
                hideInputIcon: true,
              }"
              placeholder="Выберите дату"
            />
            <template v-else-if="item === 'phone'">
              <input
                type="text"
                v-model="formData[item]"
                :id="item"
                :name="item"
                placeholder="+7 (___) ___-__-__"
              />
            </template>
            <template v-else-if="item === 'isCompleted'">
              <input
                class="addModalWindow__content__field__input"
                type="checkbox"
                v-model="formData[item]"
                :id="item"
                :name="item"
              />
            </template>
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

            <template v-else>
              <input
                type="text"
                class="addModalWindow__content__field__input"
                v-model="formData[item]"
                :id="item"
                :name="item"
              />
            </template>
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
