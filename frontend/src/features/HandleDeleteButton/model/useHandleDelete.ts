import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { deleteDataAsync } from "../api/deleteDataAsync";
import { ModalManager } from "@/shared/plugins/modalManager";
import ConfirmModal from "@/features/ConfirmModal";
import { useToast } from "vue-toastification";

export async function useHandleDelete(onUpdateCallBack: () => void) {
  const navigationStore = useNavigationStore();
  const toast = useToast();

  if (!navigationStore.selectedRow || !navigationStore.selectedRow?.id) {
    toast.info("Выберите запись для удаления", { timeout: 5000 });
    return;
  }
  const targetId = navigationStore.selectedRow?.data
    ? navigationStore.selectedRow?.data?.id
    : navigationStore.selectedRow?.id;

  const targetNodeType = navigationStore.selectedRow?.data
    ? navigationStore.selectedRow?.data?.nodeType
    : navigationStore.currentSection;

  const execute = async () => {
    console.debug(targetId, targetNodeType);
    const response = await deleteDataAsync(targetId, targetNodeType);

    if (response?.status === 200) {
      console.debug("!!!");
      onUpdateCallBack();
      ModalManager.getInstance().closeModal();
    }
  };

  ModalManager.getInstance().open(ConfirmModal, {
    action: "delete",
    section: targetNodeType,
    onSuccessCallback: execute,
    onDeclineCallback: () => ModalManager.getInstance().closeModal(),
  });
}
