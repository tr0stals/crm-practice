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

const props = defineProps<{
  sectionName: string;
  onClose: () => void;
  onSuccess: () => void;
}>();
const navigationStore = useNavigationStore();
console.debug(props.sectionName);

// TODO: Пока здесь рассчитано на org_types
const { formData, tableColumns, selectOptions, submit } = useAddEntity(
  props.sectionName,
  () => {
    props.onSuccess();
    props.onClose();
  }
);

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

async function uploadImage(file: File, relatedItemId: number) {
  const data = new FormData();
  data.append("file", file);
  data.append("targetType", props.sectionName); // "organization_types" или "components"
  data.append("targetId", String(relatedItemId));

  return await api.post("/images/upload", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

async function loadOrganizationTypes() {
  const orgTypeSubmitData = { ...formData };
  console.debug(orgTypeSubmitData);

  const res = await createEntityAsync(props.sectionName, {
    icon: orgTypeSubmitData.icon?.name,
    title: orgTypeSubmitData.title,
  });
  const createdId = res.data.id; // ID созданного типа организации

  // 2. Если есть иконка, загружаем ее и привязываем к созданной организации
  if (formData.icon instanceof File) {
    await uploadImage(formData.icon, createdId);
  }
}

async function loadComponents() {
  const data = { ...formData };
  const { photo, ...defaultData } = data;

  const res = await createEntityAsync(props.sectionName, {
    photo: photo.name,
    ...defaultData,
  });
  console.debug(res);

  const createdId = res.data.id; // ID созданного типа организации

  // 2. Если есть иконка, загружаем ее и привязываем к созданной организации
  if (formData.photo instanceof File) {
    await uploadImage(formData.photo, createdId);
  }
}

const handleSubmit = async () => {
  try {
    // 1. Сначала создаем тип организации (получаем его ID)
    if (props.sectionName === "organization_types") {
      await loadOrganizationTypes();
    } else if (props.sectionName === "components") {
      await loadComponents();
    } else {
      await submit();
    }

    props.onSuccess();
    props.onClose();
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
          <template v-if="item !== 'id' && item !== 'passwordSalt'">
            <label class="addModalWindow__content__field__label" :for="item">{{
              fieldDictionary[item] || item
            }}</label>
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
                class="addModalWindow__content__field__input"
              />
            </template>
            <input
              v-else-if="item === 'isCompleted'"
              class="addModalWindow__content__field__input"
              type="checkbox"
              v-model="formData[item]"
              :id="item"
              :name="item"
            />
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
            <template v-else-if="item === 'icon' || item === 'photo'">
              <div class="imageInput">
                <input
                  type="file"
                  id="iconUpload"
                  class="imageInput__input--hidden"
                  @change="
                    (e: any) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        formData[item] = file;
                      }
                    }
                  "
                />
                <div v-if="formData[item]" class="imageInput__textContent">
                  <span class="imageInput__header">Выбрано изображение:</span>
                  <span class="imageInput__imageTitle">{{
                    formData[item].name
                  }}</span>
                </div>
                <label for="iconUpload" class="imageInput__uploadButton">
                  Загрузить
                </label>
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
