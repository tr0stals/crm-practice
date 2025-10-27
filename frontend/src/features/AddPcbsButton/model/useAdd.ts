import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { tablesEnum } from "@/shared/config/tablesEnum";
import { ModalManager } from "@/shared/plugins/modalManager";
import { ref } from "vue";
import AddEntity from "@/features/AddEntity/ui/AddEntityModal.vue";
import { useToast } from "vue-toastification";

export function useAdd(onSuccessCallback: () => void) {
  const navigationStore = useNavigationStore();
  const section = ref<string>();
  const toast = useToast();

  const handleAddPcbs = () => {
    if (!navigationStore.selectedRow) {
      section.value = tablesEnum.pcbs;

      ModalManager.getInstance().open(AddEntity, {
        sectionName: section.value,
        onClose: () => ModalManager.getInstance().closeModal(),
        onSuccess: onSuccessCallback,
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
        onSuccess: onSuccessCallback,
      });
    }
  };

  return {
    handleAddPcbs,
    handleAddPcbsComponents,
  };
}
