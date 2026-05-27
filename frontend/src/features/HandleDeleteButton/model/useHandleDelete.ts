import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { deleteDataAsync } from "../api/deleteDataAsync";
import { ModalManager } from "@/shared/plugins/modalManager";
import ConfirmModal from "@/features/ConfirmModal";
import { useToast } from "vue-toastification";
import { ref } from "vue";

export async function useHandleDelete(onUpdateCallBack: () => void) {
  const navigationStore = useNavigationStore();
  const toast = useToast();
  const loading = ref<boolean>(false);
  console.debug("1");

  if (!navigationStore.selectedRow || !navigationStore.selectedRow?.id) {
    toast.info("Выберите запись для удаления", { timeout: 5000 });
    console.debug("2");
    return;
  }

  const targetId = navigationStore.selectedRow?.data
    ? navigationStore.selectedRow?.data?.id
    : navigationStore.selectedRow?.id;

  console.debug("3");
  const targetNodeType: string = navigationStore.selectedRow?.data
    ? navigationStore.selectedRow?.data?.nodeType
    : navigationStore.currentSection;

  const execute = async () => {
    loading.value = true;
    const response = await deleteDataAsync(targetId, targetNodeType);

    if (response?.status === 200) {
      console.debug("7");
      onUpdateCallBack();
      ModalManager.getInstance().closeModal();
      loading.value = false;
    }
  };

  ModalManager.getInstance().open(ConfirmModal, {
    action: "delete",
    section: targetNodeType,
    onSuccessCallback: () => execute(),
    onDeclineCallback: () => ModalManager.getInstance().closeModal(),
    loading: loading,
  });
}
