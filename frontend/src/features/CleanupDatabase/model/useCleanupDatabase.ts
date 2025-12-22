import ConfirmModal from "@/features/ConfirmModal";
import { api } from "@/shared/api/axiosInstance";
import { ModalManager } from "@/shared/plugins/modalManager";
import { ref } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

export function useCleanupDatabase() {
  const loading = ref<boolean>(true);

  const cleanup = async () => {
    try {
      loading.value = true;
      const response = await api.post("utils/database-cleanup/reset");

      if (response.status === 200) {
        toast.success("База данных успешно обнулена");
      } else {
        toast.error("Не удалось обнулить БД");
      }
    } catch (e) {
      console.error(e);
      toast.error("Произошла ошибка при обнулении БД");
    } finally {
      loading.value = false;
      // Закрываем модалку в любом случае
      ModalManager.getInstance().closeModal();
    }
  };

  const confirmReset = () => {
    ModalManager.getInstance().open(ConfirmModal, {
      onSuccessCallback: cleanup,
      onDeclineCallback: () => ModalManager.getInstance().closeModal(),
      loading: loading,
    });
  };

  return { confirmReset, loading };
}
