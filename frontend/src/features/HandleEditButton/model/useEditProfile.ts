import { ModalManager } from "@/shared/plugins/modalManager";
import EmployeesEditModal from "@/features/EditModalWindow/ui/EmployeesEditModal.vue";
import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";
import { useToast } from "vue-toastification";

export function useEditProfile() {
  const authorizedUser = useAuthorizedUserStore();
  const entityId = authorizedUser.user.employeeData?.id;
  const toast = useToast();

  if (entityId === 1) {
    toast.error("Администратора запрещено редактировать");
    return;
  } else {
    ModalManager.getInstance().open(EmployeesEditModal, {
      config: {
        sectionName: "employees",
        entityId: entityId,
        isProfileEdit: true,
      },
    });
  }
}
