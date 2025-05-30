<script setup lang="ts">
import type { IEdittingProps } from "@/shared/config/IEdittingProps";
import type { IData } from "@/views/Dashboard/interface/IData";
import { getDataAsync } from "@/views/Dashboard/api/licenseApi";
import "../style.scss";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { onMounted, reactive, ref } from "vue";
import { EditModalWindowModel } from "../model/EditModalWindowModel";
import { api } from "@/shared/api/axiosInstance";
import { deleteUser } from "@/shared/api/userApi";

const data = ref<any[]>([]);

const props = defineProps<{
  config: IEdittingProps;
}>();

const originalData = props.config.data;
const formData = reactive({ ...originalData });

console.debug("formData:", formData.target);

const getInputType = (key: string, value: any): string => {
  if (key.toLowerCase().includes("date")) return "date";
  if (typeof value === "boolean") return "checkbox";
  if (typeof value === "number") return "number";
  return "text";
};

onMounted(() => {
  new EditModalWindowModel();
});

console.debug(originalData);

const handleDeleteUser = async (id: number) => {
  try {
    await deleteUser(id);
    // После удаления обновите данные
    const config: IData = { endpoint: "users/get" };
    const response = await getDataAsync(config);
    data.value = response.data;
  } catch (e) {
    console.error("Ошибка при удалении пользователя:", e);
  }
};
</script>

<template>
  <div class="editModalWindow">
    <component
      class="editModalWindow__closeIcon"
      id="closeIcon"
      :is="CloseIcon"
    />
    <div class="editModalWindow__header">
      <h1 class="editModalWindow__header__title">
        {{ props.config.sectionName || "[Operation]" }}
      </h1>
      <hr class="editModalWindow__header__hr" />
    </div>

    <div class="editModalWindow__content">
      <div
        v-for="(value, key) in formData"
        :key="String(key)"
        class="editModalWindow__content__field"
      >
        <label
          class="editModalWindow__content__field__label"
          :for="String(key)"
        >
          {{ key }}
        </label>
        <input
          class="editModalWindow__content__field__input"
          :disabled="String(key) === 'id'"
          :type="getInputType(String(key), value)"
          :id="String(key)"
          :name="String(key)"
          v-model="formData[String(key)]"
        />
      </div>
    </div>
    <div class="editModalWindow__controls">
      <Button
        data-js-cancel-btn=""
        text="Отменить"
        button-color="button__buttonBlue"
        :extra-classes="['editModalWindow__controls__btn']"
      />
      <Button
        :data-js-save-btn="JSON.stringify(formData)"
        text="Сохранить"
        button-color="button__buttonBlue"
        :extra-classes="['editModalWindow__controls__btn']"
      />
    </div>
  </div>
</template>
