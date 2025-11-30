import { tablesEnum } from "@/shared/config/tablesEnum";
import { ModalManager } from "@/shared/plugins/modalManager";
import EditModalWindow from "@/features/EditModalWindow/ui/EditModalWindow.vue";
import type { IEdittingProps } from "@/shared/config/IEdittingProps";
import "../style.scss";
import EmployeesEditModal from "@/features/EditModalWindow/ui/EmployeesEditModal.vue";
import ShipmentsEditModal from "@/features/EditModalWindow/ui/ShipmentsEditModal.vue";
import StandsEditModal from "@/features/EditModalWindow/ui/StandsEditModal.vue";
import StandTasksEditModal from "@/features/EditModalWindow/ui/StandTasksEditModal.vue";
import OrganizationsEditModal from "@/features/EditModalWindow/ui/OrganizationsEditModal.vue";
import OrderRequestsEditModal from "@/features/EditModalWindow/ui/OrderRequestsEditModal.vue";
import PcbsEditModal from "@/features/EditModalWindow/ui/PcbsEditModal.vue";
import ComponentsEditModal from "@/features/EditModalWindow/ui/ComponentsEditModal.vue";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import ArrivalInvoicesEditModal from "@/features/EditModalWindow/ui/ArrivalInvoicesEditModal.vue";
import BillsForPayEditModal from "@/features/EditModalWindow/ui/BillsForPayEditModal.vue";
import { useToast } from "vue-toastification";

/**
 *    Функция срабатывает при клике клике на кнопку "Редактировать"
 *  и выбранной строке
 */
export function useHandleEdit(onUpdateCallBack: () => void) {
  /*
   *  Не удалять комментарий, чтобы не забыть логику выбора sectionName!!!
   *
   *  Цель: узнать, какую текущую секцию передавать в EditModalWindow.
   *  Логика: 1. если это Treeview - тогда выбранная строка имеет объект data - следовательно, мы выбираем ..data.nodeType
   *          2. если это табличная сущность - у нее нет объекта data, следовательно, передаем navigationStore.currentSection
   *
   *  Желательно не трогать, иначе можно получить ошибки при открытии модалки редактирования
   */
  const navigationStore = useNavigationStore();

  const sectionName = navigationStore.selectedRow?.data
    ? navigationStore.selectedRow.data?.nodeType
    : navigationStore.currentSection;

  const entityId = navigationStore.selectedRow?.id;
  const toast = useToast();

  const cfg: IEdittingProps = {
    sectionName: sectionName,
    entityId: entityId,
    isProfileEdit: false,
  };

  if (!cfg.entityId || !cfg.sectionName) {
    toast.info("Выберите запись для редактирования", { timeout: 5000 });
    return;
  }

  if (cfg.sectionName === tablesEnum.employees)
    ModalManager.getInstance().open(EmployeesEditModal, {
      config: cfg,
      onApplyCallback: onUpdateCallBack,
    });
  else if (cfg.sectionName === tablesEnum.shipments)
    ModalManager.getInstance().open(ShipmentsEditModal, {
      config: cfg,
      onApplyCallback: onUpdateCallBack,
    });
  else if (cfg.sectionName === tablesEnum.order_requests) {
    ModalManager.getInstance().open(OrderRequestsEditModal, {
      config: cfg,
      onApplyCallback: onUpdateCallBack,
    });
  } else if (cfg.sectionName === tablesEnum.organizations) {
    ModalManager.getInstance().open(OrganizationsEditModal, {
      config: cfg,
      onApplyCallback: onUpdateCallBack,
    });
  } else if (cfg.sectionName === tablesEnum.arrival_invoices) {
    ModalManager.getInstance().open(ArrivalInvoicesEditModal, {
      config: cfg,
      onApplyCallback: onUpdateCallBack,
    });
  } else if (cfg.sectionName === tablesEnum.bills_for_pay) {
    ModalManager.getInstance().open(BillsForPayEditModal, {
      config: cfg,
      onApplyCallback: onUpdateCallBack,
    });
  } else if (
    cfg.sectionName === tablesEnum.stands ||
    cfg.sectionName === tablesEnum.stands_categories
  ) {
    ModalManager.getInstance().open(StandsEditModal, {
      config: {
        sectionName: tablesEnum.stands,
        entityId: entityId,
      },
      onApplyCallback: onUpdateCallBack,
    });
  } else if (cfg.sectionName === tablesEnum.stand_tasks) {
    ModalManager.getInstance().open(StandTasksEditModal, {
      config: cfg,
      onApplyCallback: onUpdateCallBack,
    });
  } else if (
    cfg.sectionName === tablesEnum.pcbs_categories ||
    cfg.sectionName === tablesEnum.pcbs
  ) {
    cfg.sectionName = tablesEnum.pcbs;
    ModalManager.getInstance().open(PcbsEditModal, {
      config: cfg,
      onApplyCallback: onUpdateCallBack,
    });
  } else if (
    cfg.sectionName === tablesEnum.components_categories ||
    cfg.sectionName === tablesEnum.components
  ) {
    cfg.sectionName = tablesEnum.components;
    ModalManager.getInstance().open(ComponentsEditModal, {
      config: cfg,
      onApplyCallback: onUpdateCallBack,
    });
  } else {
    ModalManager.getInstance().open(EditModalWindow, {
      config: cfg,
      onApplyCallback: onUpdateCallBack,
    });
  }
}
