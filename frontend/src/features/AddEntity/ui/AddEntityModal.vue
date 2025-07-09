<script setup lang="ts">
import { useAddEntity } from "../model/useAddEntity";
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import Button from "@/shared/ui/Button/ui/Button.vue";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import "../style.scss";
import { reactive, watch, computed } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const props = defineProps<{
  sectionName: string;
  onClose: () => void;
  onSuccess: () => void;
}>();

const { formData, tableColumns, selectOptions, submit } = useAddEntity(
  props.sectionName,
  () => {
    props.onSuccess();
    props.onClose();
  }
);

console.debug(tableColumns);

function isDateField(key) {
  const lower = key.toLowerCase();
  return (
    lower.includes("date") ||
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
    await submit();
  } catch (e) {
    console.error("Ошибка при добавлении", e);
  }
};
console.debug(formData);
</script>

<template>
  <div>
    <div class="modalWindow__overlay" @click="props.onClose"></div>
    <div class="modalWindow addModalWindow">
      <CloseIcon class="addModalWindow__closeIcon" @click="props.onClose" />
      <h1>{{ props.sectionName }}</h1>
      <div class="addModalWindow__content">
        <div
          v-for="item in tableColumns"
          :key="item"
          class="addModalWindow__content__field"
        >
          {{ console.debug(typeof item) }}

          <template v-if="item !== 'id' && item !== 'passwordSalt'">
            <label :for="item">{{ fieldDictionary[item] || item }}</label>
            <template v-if="item.endsWith('Id')">
              <select v-model="formData[item]" :id="item" :name="item">
                <option value="" disabled>Выберите значение</option>
                <option
                  v-for="option in selectOptions[item]"
                  :key="option.id"
                  :value="option.id"
                >
                  {{ option.label }}
                </option>
              </select>
            </template>
            <template v-else-if="isDateField(item)">
              <VueDatePicker
                v-model="dateModel[item]"
                :id="item"
                :name="item"
                format="yyyy-MM-dd"
                model-type="yyyy-MM-dd"
                input-class-name="addModalWindow__content__field__input"
                placeholder="Выберите дату"
                auto-apply
              />
            </template>
            <template v-else-if="item === 'phone'">
              <input
                type="text"
                v-model="formData[item]"
                :id="item"
                :name="item"
                placeholder="+7 (___) ___-__-__"
              />
            </template>
            <template v-else-if="item === 'vat'">
              <div class="addModalWindow__content__field__inputControls">
                <Button
                  :class="{ active: formData.vat === true }"
                  @click="formData.vat = true"
                >
                  Да
                </Button>
                <Button
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
          @click="props.onClose"
          :extra-classes="['addModalWindow__controls__btn']"
        >
          Отмена
        </Button>
        <Button
          @click="handleSubmit"
          :extra-classes="['addModalWindow__controls__btn']"
        >
          Добавить
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modalWindow__overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
  z-index: 2000;
}
.modalWindow.addModalWindow {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 2100;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  min-width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px 24px;
}
</style>
