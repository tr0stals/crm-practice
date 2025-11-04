<script lang="ts" setup>
import CustomDropdown from "@/shared/ui/CustomDropdown/ui/CustomDropdown.vue";
import { useAdd } from "../model/useAdd";

const props = defineProps<{
  onSuccessCallback: () => void;
}>();

const { handleAddPcbs, handleAddPcbsComponents } = useAdd(
  props.onSuccessCallback
);

const dropdownConfig = [
  {
    text: "Добавить ПП",
    value: "pcbs",
    onClickCallback: handleAddPcbs,
    extraAttrs: [{ name: "id", value: "addPcbsButton" }],
  },
  {
    text: "Добавить компонент ПП",
    value: "pcbs_components",
    onClickCallback: handleAddPcbsComponents,
    extraAttrs: [{ name: "id", value: "addPcbsComponentButton" }],
  },
];
</script>
<template>
  <div class="dropdown">
    <CustomDropdown
      dropdown-title="Добавить"
      :dropdown-items="dropdownConfig"
    />
  </div>
</template>
