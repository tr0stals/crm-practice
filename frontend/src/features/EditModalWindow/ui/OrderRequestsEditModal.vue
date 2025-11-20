<script setup lang="ts">
import type { IEdittingProps } from "@/shared/config/IEdittingProps";
import "../style.scss";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { EditModalWindowModel } from "../model/EditModalWindowModel";
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import "@vuepic/vue-datepicker/dist/main.css";
import { getDataAsync } from "@/shared/api/getDataAsync";
import { relationMap } from "@/shared/config/relationMap";
import { localizatedSectionsList } from "@/shared/config/localizatedSections";
import useFetch from "@/shared/lib/useFetch";
import { defaultEndpoint } from "@/shared/api/axiosInstance";
import LoadingLayout from "@/shared/ui/LoadingLayout/ui/LoadingLayout.vue";
import { relatedFields } from "../config/relatedTables";
import DatePicker from "@/shared/ui/DatePicker/ui/DatePicker.vue";
import PhoneInput from "@/features/PhoneInput";

const resultData = ref<any>();
const formData = ref<any>({});
const dateModel = reactive<Record<string, any>>({});
const relatedOptions = reactive<Record<string, any[]>>({});
const loading = ref<boolean>(false);
const orderRequests = ref();

let model: EditModalWindowModel;

const props = defineProps<{
  config?: IEdittingProps;
  onApplyCallback: () => {};
}>();

const emits = defineEmits(["close", "save"]);

const sectionName = computed(() => props.config?.sectionName);
const entityId = computed(() => props.config?.entityId);
// const { licenseTypeId, ...originalData } = props.config?.data;

function isDateField(key: any) {
  const lower = key.toLowerCase();

  return (
    lower.includes("date") ||
    lower === "start" ||
    lower === "end" ||
    lower === "manufacturetime" ||
    lower === "timeout"
  );
}

function isObjectField(value: any) {
  return value && typeof value === "object" && !Array.isArray(value);
}

const getInputType = (key: string, value: any): string => {
  if (value === "isCompleted") return "checkbox";
  if (typeof value === "boolean") return "checkbox";
  if (typeof value === "number") return "number";
  if (isObjectField(value)) return "select";
  return "text";
};

async function loadRelatedOptions(key: string) {
  try {
    console.debug(key);
    const response = await getDataAsync({
      endpoint: `${relationMap[key] ? relationMap[key] : key}/get`,
    });
    relatedOptions[key] = response?.data ?? [];
    console.debug(relatedOptions[key]);
  } catch (error) {
    console.error(`Не удалось загрузить справочник для ${key}`, error);
    relatedOptions[key] = [];
  }
}

async function loadOrders() {
  const orders = await getDataAsync({ endpoint: "order_requests/get" });

  return orders;
}

function isRelatedField(key: string, value: any): boolean {
  return (
    isObjectField(value) ||
    relatedFields.includes(key) ||
    relatedFields.includes(relationMap[key])
  );
}

onMounted(async () => {
  model = new EditModalWindowModel(props.onApplyCallback);

  const { data, loading, error, refetch } = useFetch<any>(
    `${defaultEndpoint}/${sectionName.value}/get/${entityId.value}`
  );

  watch(
    () => loading.value,
    (newVal) => {
      loading.value = newVal;
    }
  );

  // Ждём, пока данные появятся
  watch(
    () => data.value,
    async (newData) => {
      if (!newData) return;

      resultData.value = newData;
      formData.value = { ...newData };
      orderRequests.value = (await loadOrders()).data;

      // Поиск полей с датами
      const dateFields = Object.keys(formData.value).filter(isDateField);
      dateFields.forEach((key) => {
        dateModel[key] = formData.value[key]
          ? formData.value[key].slice(0, 10)
          : null;

        watch(
          () => dateModel[key],
          (val) => {
            formData.value[key] = val || null;
          }
        );
      });

      // Поиск полей-объектов (foreign keys)
      const objectFields = Object.entries(formData.value).filter(
        ([key, value]) =>
          isObjectField(value) ||
          relatedFields.includes(key) ||
          relatedFields.includes(relationMap[key])
      );

      for (const [key] of objectFields) {
        await loadRelatedOptions(key);
      }
    },
    { immediate: true }
  );
});

onUnmounted(() => {
  model?.destroy();
});
</script>

<template>
  <LoadingLayout v-if="loading" />
  <div
    v-else-if="!loading"
    id="modalWindow"
    class="modalWindow editModalWindow"
  >
    <component
      class="editModalWindow__closeIcon"
      id="closeIcon"
      :is="CloseIcon"
    />
    <div class="editModalWindow__header">
      <h1 class="editModalWindow__header__title">
        {{ localizatedSectionsList[sectionName] || "[Operation]" }}
      </h1>
      <hr class="editModalWindow__header__hr" />
    </div>

    <div class="editModalWindow__content">
      <div
        v-for="(value, key) in formData"
        :key="key"
        class="editModalWindow__content__field"
      >
        <label
          v-if="key !== 'id' && key !== 'employeeCreator'"
          class="editModalWindow__content__field__label"
          :for="key"
        >
          {{ fieldDictionary[key] }}
        </label>

        <!-- Date -->
        <DatePicker
          v-if="isDateField(key)"
          v-model="dateModel[key]"
          :id="key"
          :name="key"
          :config="{
            disabled: key === 'id',
            format: 'yyyy-MM-dd',
            hideInputIcon: true,
          }"
          placeholder="Выберите дату"
        />

        <select
          v-else-if="key !== 'employeeCreator' && isRelatedField(key, value)"
          class="editModalWindow__content__field__input"
          :id="key"
          :name="key"
          :value="formData[key]?.id"
          @change="
            (e: any) => {
              const selectedId = e.target.value;
              if (selectedId === 'null') {
                formData[key] = null;
              } else {
                const selected = relatedOptions[key]?.find(
                  (item: any) => item.id === Number(selectedId)
                );
                formData[key] = selected || null;
              }
            }
          "
        >
          <option value="">Не выбрано</option>
          <option
            v-for="item in relatedOptions[key]"
            :key="item.id"
            :value="item.id"
          >
            <template v-if="item === null">
              <option value="">Не выбрано</option>
            </template>
            <template v-else>
              {{
                item.title ||
                item.name ||
                item.state ||
                item.numberBill ||
                item.shortName ||
                item.numberInvoice ||
                item.professions?.title ||
                item.date ||
                item.shipmentDate ||
                (item.licenseCode && item.licenseTypes
                  ? `Лицензия: ${item.licenseCode} Тип: ${item.licenseTypes.title}`
                  : "") ||
                (item.placementType && item.placementType.title
                  ? `${item.placementType.title} /`
                  : "") +
                  (item.building ? ` здание ${item.building} /` : "") +
                  (item.room ? ` комната ${item.room}` : "") ||
                (item.peoples
                  ? `${item.peoples.firstName} ${item.peoples.lastName} ${item.peoples.middleName}`
                  : item.code ||
                    `${item.firstName} ${item.lastName} ${item.middleName}`)
              }}
            </template>
          </option>
        </select>

        <!-- Phone mask -->
        <PhoneInput
          v-else-if="key === 'phone'"
          v-model="formData[key]"
          :id="key"
          :name="key"
          class="addModalWindow__content__field__input"
        />

        <!-- Generic input -->
        <input
          v-else-if="key !== 'id' && key !== 'employeeCreator'"
          class="editModalWindow__content__field__input"
          :type="getInputType(key, value)"
          :id="key"
          :name="key"
          v-model="formData[key]"
        />
      </div>
    </div>
    <div class="editModalWindow__controls">
      <Button
        :data-js-apply-btn="
          JSON.stringify({ sectionName: props.config?.sectionName, formData })
        "
        button-color="button__buttonBlue"
        :extra-classes="['editModalWindow__controls__btn']"
      >
        Сохранить
      </Button>
      <Button
        data-js-cancel-btn=""
        button-color="button__buttonBlue"
        :extra-classes="['editModalWindow__controls__btn']"
      >
        Отмена
      </Button>
    </div>
  </div>
</template>
