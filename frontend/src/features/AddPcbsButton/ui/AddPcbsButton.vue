<script lang="ts" setup>
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import CustomDropdown from "@/shared/ui/CustomDropdown/ui/CustomDropdown.vue";
import { ref } from "vue";
import { useToast } from "vue-toastification";
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
  },
  {
    text: "Добавить компонент ПП",
    value: "pcbs_components",
    onClickCallback: handleAddPcbsComponents,
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
