<script setup lang="ts">
import type { IEdittingProps } from "@/shared/config/IEdittingProps";
import "../style.scss";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { onMounted, reactive, ref } from "vue";
import { EditModalWindowModel } from "../model/EditModalWindowModel";
import { getDataAsync } from "@/shared/api/getDataAsync";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps<{
  config?: IEdittingProps;
  onApplyCallback: () => {};
}>();

const formData = reactive({
  id: props.config?.data.id,
  birthDate: props.config?.data.birthDate,
  professionId: props.config?.data.profession?.id,
  firstName: props.config?.data.peoples?.firstName,
  lastName: props.config?.data.peoples?.lastName,
  middleName: props.config?.data.peoples?.middleName,
  phone: props.config?.data.peoples?.phone,
  email: props.config?.data.peoples?.email,
  comment: props.config?.data.peoples?.comment,
});

const professions = ref([]);
onMounted(async () => {
  const { data } = await getDataAsync({ endpoint: '/professions/get' });
  professions.value = data;
  new EditModalWindowModel(props.onApplyCallback);
});
</script>

<template>
  <div>
    <div class="modalWindow__overlay" @click="props.onApplyCallback"></div>
    <div class="editModalWindow">
      <CloseIcon class="editModalWindow__closeIcon" @click="props.onApplyCallback" />
      <div class="editModalWindow__header">
        <h1 class="editModalWindow__header__title">
          {{ props.config?.sectionName || "[Operation]" }}
        </h1>
        <hr class="editModalWindow__header__hr" />
      </div>
      <div class="editModalWindow__content">
        <div class="editModalWindow__content__field">
          <label class="editModalWindow__content__field__label">Фамилия</label>
          <input v-model="formData.lastName" class="editModalWindow__content__field__input" />
        </div>
        <div class="editModalWindow__content__field">
          <label class="editModalWindow__content__field__label">Имя</label>
          <input v-model="formData.firstName" class="editModalWindow__content__field__input" />
        </div>
        <div class="editModalWindow__content__field">
          <label class="editModalWindow__content__field__label">Отчество</label>
          <input v-model="formData.middleName" class="editModalWindow__content__field__input" />
        </div>
        <div class="editModalWindow__content__field">
          <label class="editModalWindow__content__field__label">Дата рождения</label>
          <VueDatePicker v-model="formData.birthDate" format="yyyy-MM-dd" model-type="yyyy-MM-dd" input-class-name="editModalWindow__content__field__input" />
        </div>
        <div class="editModalWindow__content__field">
          <label class="editModalWindow__content__field__label">Должность</label>
          <select v-model="formData.professionId" class="editModalWindow__content__field__input">
            <option v-for="p in professions" :key="p.id" :value="p.id">{{ p.title }}</option>
          </select>
        </div>
        <div class="editModalWindow__content__field">
          <label class="editModalWindow__content__field__label">Телефон</label>
          <input v-model="formData.phone" class="editModalWindow__content__field__input" />
        </div>
        <div class="editModalWindow__content__field">
          <label class="editModalWindow__content__field__label">Email</label>
          <input v-model="formData.email" class="editModalWindow__content__field__input" />
        </div>
        <div class="editModalWindow__content__field">
          <label class="editModalWindow__content__field__label">Комментарий</label>
          <input v-model="formData.comment" class="editModalWindow__content__field__input" />
        </div>
      </div>
      <div class="editModalWindow__controls">
        <Button
          data-js-cancel-btn=""
          button-color="button__buttonBlue"
          :extra-classes="['editModalWindow__controls__btn']"
        >
          Отмена
        </Button>
        <Button
          :data-js-apply-btn="JSON.stringify({ sectionName: props.config?.sectionName, formData })"
          button-color="button__buttonBlue"
          :extra-classes="['editModalWindow__controls__btn']"
        >
          Сохранить
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modalWindow__overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.25);
  z-index: 2000;
}
.editModalWindow {
  position: fixed;
  top: 50%; left: 50%;
  z-index: 2100;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  min-width: 600px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 48px 40px;
}
.editModalWindow__content__field__input {
  font-size: 1.7em;
  min-width: 320px;
  min-height: 48px;
  padding: 16px 22px;
}
.editModalWindow__content__field__label {
  font-size: 1.4em;
}
</style>
