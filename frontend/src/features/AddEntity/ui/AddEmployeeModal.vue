<script setup lang="ts">
import { reactive, watch, computed } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useAddEntity } from "../model/useAddEntity";
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import Button from "@/shared/ui/Button/ui/Button.vue";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import { localizatedSectionsList } from "@/shared/config/localizatedSections";

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

// Даты для VueDatePicker
const dateFields = computed(() => ["hiringDate", "dismissalDate"]);
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
          <label class="addModalWindow__content__field__label" :for="item">{{
            fieldDictionary[item]
          }}</label>

          <!-- Даты -->
          <template v-if="dateFields.includes(item)">
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

          <!-- Селекты -->
          <template
            v-else-if="['peoples', 'departments', 'professions'].includes(item)"
          >
            <select
              v-model="formData[item]"
              :id="item"
              :name="item"
              class="addModalWindow__content__field__option"
            >
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

          <!-- Чекбоксы и специальные поля -->
          <template v-else-if="item === 'isCompleted'">
            <input
              type="checkbox"
              v-model="formData[item]"
              :id="item"
              :name="item"
            />
          </template>

          <template v-else-if="item === 'vat'">
            <div class="addModalWindow__content__field__inputControls">
              <Button
                :class="{ active: formData.vat }"
                @click="formData.vat = true"
                >Да</Button
              >
              <Button
                :class="{ active: !formData.vat }"
                @click="formData.vat = false"
                >Нет</Button
              >
            </div>
          </template>

          <!-- Все остальные поля обычные input -->
          <template v-else>
            <input
              type="text"
              v-model="formData[item]"
              :id="item"
              :name="item"
              class="addModalWindow__content__field__input"
            />
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
