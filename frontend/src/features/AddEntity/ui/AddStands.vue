<script setup lang="ts">
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import Button from "@/shared/ui/Button/ui/Button.vue";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import "../style.scss";
import { reactive, watch, computed } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import { localizatedSectionsList } from "@/shared/config/localizatedSections";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { useAddStands } from "../model/useAddStands";
import DatePicker from "@/shared/ui/DatePicker/ui/DatePicker.vue";
import { isDateField } from "@/shared/utils/isDateField";
import { useToast } from "vue-toastification";
import { useFormValidation } from "@/shared/plugins/validation";

const props = defineProps<{
  sectionName: string;
  onClose: () => void;
  onSuccess: () => void;
}>();
const navigationStore = useNavigationStore();
const toast = useToast();

const { formData, tableColumns, selectOptions, submit } = useAddStands(
  props.sectionName,
  () => {
    props.onSuccess();
    props.onClose();
  }
);

const { errors, handleInput, validateForm } = useFormValidation(formData);

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

    await submit();
  } catch (e) {
    console.debug(e);
    toast.error(`Ошибка при добавлении ${e}`, { timeout: 5000 });
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
          v-for="field in tableColumns"
          :key="field"
          class="addModalWindow__content__field"
        >
          <div
            v-if="
              field !== 'id' &&
              field !== 'passwordSalt' &&
              field !== 'standTypeId'
            "
            class="addModalWindow__contentBlock"
          >
            <label class="addModalWindow__content__field__label" :for="field">{{
              fieldDictionary[field] || field
            }}</label>
            <template v-if="field === 'parentId'">
              <select
                v-model="formData[field]"
                :id="field"
                :name="field"
                class="addModalWindow__content__field__option"
              >
                <option :value="null">Без категории</option>
                <template
                  :key="option.id"
                  v-for="option in selectOptions[field]"
                >
                  <option :value="option.id">
                    {{ option.label }}
                  </option>
                </template>
              </select>
            </template>
            <template v-else-if="field.endsWith('Id')">
              <select
                v-model="formData[field]"
                :id="field"
                :name="field"
                class="addModalWindow__content__field__option"
              >
                <template
                  :key="option.id"
                  v-for="option in selectOptions[field]"
                >
                  <option :value="option.id">
                    {{ option.label }}
                  </option>
                </template>
              </select>
            </template>
            <DatePicker
              v-else-if="isDateField(field)"
              v-model="dateModel[field]"
              :id="field"
              :name="field"
              :config="{
                disabled: field === 'id',
                format: 'yyyy-MM-dd',
                hideInputIcon: true,
              }"
              placeholder="Выберите дату"
            />
            <template v-else-if="field === 'isCompleted'">
              <input
                class="addModalWindow__content__field__input"
                type="checkbox"
                v-model="formData[field]"
                :id="field"
                :name="field"
              />
            </template>
            <template v-else-if="field === 'vat'">
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
                v-model="formData[field]"
                :id="field"
                :name="field"
              />
            </template>
          </div>
          <p v-if="errors[sectionName ?? 'global']?.[field]" class="error-text">
            {{ errors[sectionName ?? 'global'][field] }}
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
