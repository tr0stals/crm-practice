<script setup lang="ts">
import "../style.scss";
import CustomDropdown from "@/shared/ui/CustomDropdown/ui/CustomDropdown.vue";
import { exportTable } from "../api/exportTable";
import { useToast } from "vue-toastification";
import { ref, computed } from "vue";
import { value } from "@primeuix/themes/aura/knob";
import exportIcon from "../../../../public/assets/exportIcon.png"

const toast = useToast();

const props = defineProps<{
  onSuccessCallback: () => void;
}>();

// ----------------------------
// 1) Таблицы
// ----------------------------
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

// ----------------------------
// 2) Форматы
// ----------------------------
const formats = [
  { text: "CSV", value: "csv" },
  { text: "XLSX", value: "xlsx" },
];

async function handleExport(format: string) {
  if (!selectedTable.value) {
    toast.error("Выберите таблицу");
    return;
  }

  try {
    await exportTable(selectedTable.value, format);
    props.onSuccessCallback?.();
  } catch {
    toast.error("Ошибка экспорта");
  }
}

const dropdownConfig = computed(() => {
  return [
    ...tables.map((t) => ({
      text: t.title,
      value: t.value,
      active: selectedTable.value === t.value,
      onClickCallback: () => (selectedTable.value = t.value),
    })),

    { text: "── Формат ──", value: null },

    ...formats.map((f) => ({
      text: f.text + (selectedTable.value ? "" : " (сперва выберите таблицу)"),
      value: f.value,
      onClickCallback: () =>
        selectedTable.value ? handleExport(f.value) : null,
    })),
  ];
});
</script>

<template>
    <!-- <span class="exportTableButton__tooltip">Экспортировать таблицу</span> -->
    <div class="dropdown exportTableButton">
      <CustomDropdown
        :extra-classes="['customDropdown--baseWidth']"
        :dropdown-items="dropdownConfig"
      >
        <template #title>
          <img class="customDropdown__icon" :src="exportIcon" alt="" />
        </template>
      </CustomDropdown>
    </div>
   
</template>
