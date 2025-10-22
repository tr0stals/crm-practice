<script lang="ts" setup>
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { tablesEnum } from "@/shared/config/tablesEnum";
import { ModalManager } from "@/shared/plugins/modalManager";
import CustomDropdown from "@/shared/ui/CustomDropdown/ui/CustomDropdown.vue";
import { ref } from "vue";
import AddEntity from "@/features/AddEntity/ui/AddEntityModal.vue";
import { useToast } from "vue-toastification";

const props = defineProps<{
  onSuccessCallback: () => void;
}>();

const navigationStore = useNavigationStore();
const section = ref<string>();
const toast = useToast();

const handleAddPcbs = () => {
  if (!navigationStore.selectedRow) {
    section.value = tablesEnum.pcbs;

    ModalManager.getInstance().open(AddEntity, {
      sectionName: section.value,
      onClose: () => ModalManager.getInstance().closeModal(),
      onSuccess: props.onSuccessCallback,
    });
  }
};

const handleAddPcbsComponents = () => {
  if (!navigationStore.selectedRow?.data?.nodeType) {
    toast.info("Выберите печатную плату", { timeout: 5000 });
  }

  if (navigationStore.selectedRow?.data?.nodeType === tablesEnum.pcbs) {
    section.value = tablesEnum.pcbs_components;
    ModalManager.getInstance().open(AddEntity, {
      sectionName: section.value,
      onClose: () => ModalManager.getInstance().closeModal(),
      onSuccess: props.onSuccessCallback,
    });
  }
};

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
