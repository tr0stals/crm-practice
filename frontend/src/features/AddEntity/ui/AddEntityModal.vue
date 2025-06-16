<script setup lang="ts">
import { useAddEntity } from "../model/useAddEntity";
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import Button from "@/shared/ui/Button/ui/Button.vue";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import "../style.scss";

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

const handleSubmit = async () => {
  try {
    await submit();
  } catch (e) {
    console.error("Ошибка при добавлении", e);
  }
};
</script>

<template>
  <div class="modalWindow addModalWindow">
    <CloseIcon class="addModalWindow__closeIcon" @click="props.onClose" />
    <h1>{{ props.sectionName }}</h1>
    <div class="addModalWindow__content">
      <div
        v-for="item in tableColumns"
        :key="item"
        class="addModalWindow__content__field"
      >
        <template v-if="item !== 'id'">
          <label :for="item">{{ fieldDictionary[item] || item }}</label>
          <template v-if="item.endsWith('Id')">
            <select v-model="formData[item]" :id="item" :name="item">
              <option value="" disabled>Выберите значение</option>
              <option
                v-for="option in selectOptions[item]"
                :key="option.id"
                :value="option.id"
              >
                {{
                  option.name ||
                  option.title ||
                  option.code ||
                  option.shortName ||
                  option.firstName + " " + option.lastName ||
                  "ID: " + option.id
                }}
              </option>
            </select>
          </template>
          <template v-else>
            <input
              type="text"
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
</template>
