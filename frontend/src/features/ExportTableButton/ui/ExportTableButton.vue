<script setup lang="ts">
import "../style.scss";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { exportTable } from "../api/exportTable";
import CustomDropdown from "@/shared/ui/CustomDropdown/ui/CustomDropdown.vue";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { useToast } from "vue-toastification";

const toast = useToast();
const props = defineProps<{
  onSuccessCallback: () => void;
}>();

const navigationStore = useNavigationStore();

async function handleClick(format: string) {
  try {
    const response = await exportTable(navigationStore.currentSection, format);
  } catch (e) {
    toast.error("Не удалось экспортировать БД", { timeout: 5000 });
  }
}

/*
 * Жестко привязано к CSV и XLSX - так как на бэкенде существует только 2 формата.
 */
const dropdownConfig = [
  {
    text: "CSV",
    value: "csv",
    onClickCallback: handleClick,
    isImport: false,
  },
  {
    text: "XLSX",
    value: "xlsx",
    onClickCallback: handleClick,
    isImport: false,
  },
];
</script>
<template>
  <div class="dropdown exportTableButton">
    <CustomDropdown
      dropdown-title="Экспортировать таблицу"
      :dropdown-items="dropdownConfig"
    />
  </div>
</template>
