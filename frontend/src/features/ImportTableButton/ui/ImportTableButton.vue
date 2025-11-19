<script setup lang="ts">
import "../style.scss";
import CustomDropdown from "@/shared/ui/CustomDropdown/ui/CustomDropdown.vue";
import { ref, computed } from "vue";
import { useToast } from "vue-toastification";
import useImportTable from "../model/useImportTable";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import importIcon from "../../../../public/assets/importIcon.png"

const toast = useToast();
const navigationStore = useNavigationStore();

const { selectedFile, loading, importTable } = useImportTable();

const tables = [
  { title: "Накладные", value: "arrival_invoices" },
  { title: "Счета", value: "bills_for_pay" },
  { title: "Заявки на заказ", value: "order_requests" },
  { title: "Организации", value: "organizations" },
  { title: "Сотрудники", value: "employees" },
  { title: "Люди", value: "peoples" },
  { title: "Лицензии", value: "license" },
  { title: "Стенды", value: "stands" },
  { title: "Задачи стенда", value: "stand_tasks" },
  { title: "Отгрузки", value: "shipments" },
  { title: "Текущие задачи", value: "current_tasks" },
  { title: "Состояния текущих задач", value: "current_task_states" },
  { title: "Компоненты", value: "components" },
  { title: "Размещение компонентов", value: "component_placement" },
  { title: "Списания", value: "writeoff" },
  { title: "Инвентаризация", value: "inventarization" },
  { title: "Заказы ПП", value: "pcb_orders" },
  { title: "Печатные платы", value: "pcbs" },
  { title: "Пользователь", value: "user" },
  { title: "Журнал состояний текущих задач", value: "current_task_states_log" },
];

const selectedTable = ref<string>("");

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileSelect = () => {
  fileInput.value?.click();
};

const handleFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;

  selectedFile.value = input.files[0];

  try {
    await importTable(selectedTable.value);
    toast.success("Импорт завершён");
  } catch {
    toast.error("Ошибка импорта");
  }
};

// dropdown config
const dropdownItems = computed(() => {
  return [
    ...tables.map((t) => ({
      text: t.title,
      value: t.value,
      active: selectedTable.value === t.value,
      onClickCallback: () => (selectedTable.value = t.value),
    })),

    { text: "──────", value: null },

    {
      text: loading.value
        ? "⏳ Импорт..."
        : selectedTable.value
        ? "📤 Выбрать файл"
        : "📤 Выбрать файл (сперва выберите таблицу)",
      value: "choose_file",
      onClickCallback: () => {
        if (!selectedTable.value || loading.value) return;
        triggerFileSelect();
      },
    },
  ];
});
</script>

<template>
  <!-- скрытое поле выбора файла -->
  <input
    ref="fileInput"
    type="file"
    class="d-none"
    @change="handleFileChange"
  />

  <div class="dropdown importTableButton">
    <CustomDropdown
      :extra-classes="['customDropdown--baseWidth']"
      :dropdown-items="dropdownItems"
    >
      <template #title>
        <img class="customDropdown__icon" :src="importIcon" alt="" />
      </template>
    </CustomDropdown>
  </div>
</template>
