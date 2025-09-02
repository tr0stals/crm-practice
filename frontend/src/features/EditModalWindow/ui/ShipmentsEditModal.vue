<script setup lang="ts">
import type { IEdittingProps } from "@/shared/config/IEdittingProps";
import "../style.scss";
import CloseIcon from "@/shared/ui/CloseIcon/ui/CloseIcon.vue";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { EditModalWindowModel } from "../model/EditModalWindowModel";
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { getDataAsync } from "@/shared/api/getDataAsync";
import { relationMap } from "@/shared/config/relationMap";
import { localizatedSectionsList } from "@/shared/config/localizatedSections";
import useFetch from "@/shared/lib/useFetch";
import { defaultEndpoint } from "@/shared/api/axiosInstance";
import LoadingLayout from "@/shared/ui/LoadingLayout/ui/LoadingLayout.vue";
import { updateAsync } from "../api/updateAsync";

const resultData = ref<any>();
const formData = ref<any>({});
const dateModel = reactive<Record<string, any>>({});
const relatedOptions = reactive<Record<string, any[]>>({});
const loading = ref<boolean>(false);
const peopleId = ref<number>();
const people = ref();
const employeeProfessionsId = ref<number>();
const shipmentStandId = ref<number>();

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
    const response = await getDataAsync({
      endpoint: `${relationMap[key] ? relationMap[key] : key}/get`,
    });
    relatedOptions[key] = response?.data ?? [];
  } catch (error) {
    console.error(`Не удалось загрузить справочник для ${key}`, error);
    relatedOptions[key] = [];
  }
}

const getStand = async (id: number) => {
  const stand = await getDataAsync({
    endpoint: `shipments_stands/getByShipment/${id}`,
  });

  return stand;
};

async function handleSubmit() {
  console.debug(formData.value);
  const shipmentData = {
    id: formData.value.id,
    addedDate: formData.value.addedDate,
    arrivalDate: formData.value.arrivalDate,
    shipmentDate: formData.value.shipmentDate,
    price: formData.value.price,
    specificationImage: formData.value.specificationImage,
    comment: formData.value.comment,
    licenses: formData.value.licenses,
    factory: formData.value.factory,
    transporter: formData.value.transporter,
    client: formData.value.client,
  };

  const shipmentsStandsData = {
    id: shipmentStandId.value,
    shipments: shipmentData,
    stands: formData.value.stands,
  };

  await updateAsync("shipments", shipmentData);
  await updateAsync("shipments_stands", shipmentsStandsData);

  model.destroy();
  props.onApplyCallback();
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
      console.debug(newData);

      const shipmentStand = await getStand(newData.id);
      shipmentStandId.value = shipmentStand.data.id;

      const stand = shipmentStand.data.stands;
      const { id, ...defaultStand } = stand;

      formData.value = {
        ...newData,
        stands: stand,
      };

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
      const objectFields = Object.entries(formData.value).filter(([, value]) =>
        isObjectField(value)
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
          v-if="key !== 'id'"
          class="editModalWindow__content__field__label"
          :for="key"
        >
          {{ fieldDictionary[key] }}
        </label>

        <!-- Date -->
        <VueDatePicker
          v-if="isDateField(key)"
          v-model="dateModel[key]"
          :id="key"
          :name="key"
          :disabled="key === 'id'"
          format="yyyy-MM-dd"
          model-type="yyyy-MM-dd"
          input-class-name="editModalWindow__content__field__input"
          placeholder="Выберите дату"
          auto-apply
        />

        <!-- Select for object (relation) -->
        <select
          v-else-if="isObjectField(value)"
          class="editModalWindow__content__field__input"
          :id="key"
          :name="key"
          :value="formData[key]?.id"
          @change="
            (e: any) => {
              const selected = relatedOptions[key]?.find(
                (item: any) => item.id === Number(e.target.value)
              );
              formData[key] = selected || null;
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
        <input
          v-else-if="key === 'phone'"
          class="editModalWindow__content__field__input"
          :disabled="key === 'id'"
          type="text"
          v-model="formData[key]"
          :id="key"
          :name="key"
          placeholder="+7 (___) ___-__-__"
        />

        <!-- Generic input -->
        <input
          v-else-if="key !== 'id'"
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
        @click="handleSubmit()"
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
