<script setup lang="ts">
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import Button from "@/shared/ui/Button/ui/Button.vue";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import "../style.scss";
import { reactive, watch, computed } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import { localizatedSectionsList } from "@/shared/config/localizatedSections";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { useAddOrganizations } from "../model/useAddOrganizations";
import { useAddArrivalInvoices } from "../model/useAddArrivalInvoices";
import { useAddLicenses } from "../model/useAddLicenses";
import { useAddStandTasksComponents } from "../model/useAddStandTasksComponents";
import DatePicker from "@/shared/ui/DatePicker/ui/DatePicker.vue";
import axios from "axios";
import { api } from "@/shared/api/axiosInstance";
import { useAddEntity } from "../model/useAddEntity";
import { createEntityAsync } from "../api/createEntityAsync";
import { isDateField } from "@/shared/utils/isDateField";
import { useAddPcbs } from "../model/useAddPcbs";
import { useAddPcbsComponents } from "../model/useAddPcbsComponents";
import { useToast } from "vue-toastification";
import { useAddInvoiceComponents } from "../model/useAddInvoiceComponents";
import { useFormValidation } from "@/shared/plugins/validation";
import { useAddOrderRequests } from "../model/useAddOrderRequests";

const props = defineProps<{
  sectionName: string;
  onClose: () => void;
  onSuccess: () => void;
}>();
const toast = useToast();
const navigationStore = useNavigationStore();
console.debug(props.sectionName);

const { formData, tableColumns, selectOptions, submit } =
  props.sectionName === "organizations"
    ? useAddOrganizations(props.sectionName, () => {
        props.onSuccess();
        props.onClose();
      })
    : props.sectionName === "arrival_invoices"
    ? useAddArrivalInvoices(props.sectionName, () => {
        props.onSuccess();
        props.onClose();
      })
    : props.sectionName === "license"
    ? useAddLicenses(props.sectionName, () => {
        props.onSuccess();
        props.onClose();
      })
    : props.sectionName === "stand_tasks_components"
    ? useAddStandTasksComponents(props.sectionName, () => {
        props.onSuccess();
        props.onClose();
      })
    : props.sectionName === "order_requests"
    ? useAddOrderRequests(props.sectionName, () => {
        props.onSuccess();
        props.onClose();
      })
    : props.sectionName === "arrival_invoices"
    ? useAddArrivalInvoices(props.sectionName, () => {
        props.onSuccess();
        props.onClose();
      })
    : props.sectionName === "invoices_components"
    ? useAddInvoiceComponents(props.sectionName, () => {
        props.onSuccess();
        props.onClose();
      })
    : props.sectionName === "pcbs"
    ? useAddPcbs(props.sectionName, () => {
        props.onSuccess();
        props.onClose();
      })
    : props.sectionName === "pcbs_components"
    ? useAddPcbsComponents(props.sectionName, () => {
        props.onSuccess();
        props.onClose();
      })
    : useAddEntity(props.sectionName, () => {
        props.onSuccess();
        props.onClose();
      });

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

async function uploadImage(file: File, orgTypeId: number) {
  const data = new FormData();
  data.append("file", file);
  data.append("organizationTypeId", String(orgTypeId)); // ID созданной организации

  try {
    const res = await api.post("/images/upload", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

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

            <!-- поля с окончанием Id -->
            <template v-else-if="item.endsWith('Id')">
              <select
                v-model="formData[item]"
                :id="item"
                :name="item"
                class="addModalWindow__content__field__option"
              >
                <option value="" disabled>Выберите значение</option>
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
              :config="{
                disabled: item === 'id',
                format: 'yyyy-MM-dd',
                hideInputIcon: true,
              }"
              placeholder="Выберите дату"
            />

            <!-- телефон -->
            <input
              v-else-if="item === 'phone'"
              type="text"
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
            <template
              v-else-if="
                item === 'vat' ||
                item === 'digitalDocs' ||
                item === 'isCompleted'
              "
            >
              <div class="addModalWindow__content__field__inputControls">
                <Button
                  class="addModalWindow__content__field__inputControls__btn"
                  :class="{ active: formData[item] === true }"
                  @click="formData[item] = true"
                >
                  Да
                </Button>
                <Button
                  class="addModalWindow__content__field__inputControls__btn"
                  :class="{ active: formData[item] === false }"
                  @click="formData[item] = false"
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
