import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { tablesEnum } from "@/shared/config/tablesEnum";
import { ModalManager } from "@/shared/plugins/modalManager";
import { ref, watch } from "vue";
import "../style.scss";
import AddEntity from "@/features/AddEntity/ui/AddEntityModal.vue";
import AddEmployees from "@/features/AddEntity/ui/AddEmployees.vue";
import AddLicenses from "@/features/AddEntity/ui/AddLicenses.vue";
import AddShipments from "@/features/AddEntity/ui/AddShipments.vue";
import AddStands from "@/features/AddEntity/ui/AddStands.vue";
import AddStandTasks from "@/features/AddEntity/ui/AddStandTasks.vue";
import AddModalWithImages from "@/features/AddEntity/ui/AddModalWithImages.vue";

export function useCreateButton(onUpdateCallBack: () => void) {
  const navigationStore = useNavigationStore();
  const currentSection = ref(navigationStore.currentSection);

  watch(
    () => navigationStore.currentSection,
    (val) => {
      currentSection.value = val;
    }
  );

  const cfg = {
    sectionName: currentSection.value,
    endpoint: `${currentSection.value}/create`,
  };
  const section = ref<string | null>(null);

  if (!cfg.sectionName) {
    alert("Выберите таблицу для добавления!");
    return;
  }

  switch (currentSection.value) {
    case tablesEnum.employees:
      if (!navigationStore.selectedRow) {
        section.value = tablesEnum.departments;
        ModalManager.getInstance().open(AddEntity, {
          sectionName: section.value,
          onClose: () => ModalManager.getInstance().closeModal(),
          onSuccess: onUpdateCallBack,
        });
      }

      if (
        navigationStore.selectedRow?.data?.nodeType === tablesEnum.departments
      ) {
        section.value = tablesEnum.employees;
        ModalManager.getInstance().open(AddEmployees, {
          sectionName: section.value,
          onClose: () => ModalManager.getInstance().closeModal(),
          onSuccess: onUpdateCallBack,
        });
      }

      break;

    case tablesEnum.stands:
      if (!navigationStore.selectedRow) {
        section.value = tablesEnum.stands_types;
        ModalManager.getInstance().open(AddEntity, {
          sectionName: section.value,
          onClose: () => ModalManager.getInstance().closeModal(),
          onSuccess: onUpdateCallBack,
        });
      }

      if (
        navigationStore.selectedRow?.data?.nodeType ===
          tablesEnum.stands_types ||
        navigationStore.selectedRow?.data?.nodeType === tablesEnum.stands
      ) {
        section.value = tablesEnum.stands;
        ModalManager.getInstance().open(AddModalWithImages, {
          sectionName: section.value,
          onClose: () => ModalManager.getInstance().closeModal(),
          onSuccess: onUpdateCallBack,
        });
      }
      break;

    case tablesEnum.stand_tasks:
      if (navigationStore.selectedRow?.data?.nodeType === tablesEnum.stands) {
        section.value = tablesEnum.stand_tasks;
        ModalManager.getInstance().open(AddModalWithImages, {
          sectionName: section.value,
          onClose: () => ModalManager.getInstance().closeModal(),
          onSuccess: onUpdateCallBack,
        });
      }

      if (
        navigationStore.selectedRow?.data?.nodeType === tablesEnum.stand_tasks
      ) {
        section.value = tablesEnum.stand_tasks_components;
        ModalManager.getInstance().open(AddEntity, {
          sectionName: section.value,
          onClose: () => ModalManager.getInstance().closeModal(),
          onSuccess: onUpdateCallBack,
        });
      }

      break;

    case tablesEnum.organizations:
      if (!navigationStore.selectedRow) {
        section.value = tablesEnum.organization_types;

        ModalManager.getInstance().open(AddModalWithImages, {
          sectionName: section.value,
          onClose: () => ModalManager.getInstance().closeModal(),
          onSuccess: onUpdateCallBack,
        });
      }

      if (
        navigationStore.selectedRow?.data?.nodeType ===
          tablesEnum.organization_types ||
        navigationStore.selectedRow?.data?.nodeType === tablesEnum.organizations
      ) {
        section.value = tablesEnum.organizations;

        ModalManager.getInstance().open(AddEntity, {
          sectionName: section.value,
          onClose: () => ModalManager.getInstance().closeModal(),
          onSuccess: onUpdateCallBack,
        });
      }
      break;

    case tablesEnum.arrival_invoices:
      if (!navigationStore.selectedRow)
        section.value = tablesEnum.arrival_invoices;
      if (
        navigationStore.selectedRow?.data?.nodeType ===
        tablesEnum.arrival_invoices
      )
        section.value = tablesEnum.invoices_components;
      break;

    case tablesEnum.bills_for_pay:
      if (!navigationStore.selectedRow)
        section.value = tablesEnum.bills_for_pay;
      if (
        navigationStore.selectedRow?.data?.nodeType === tablesEnum.bills_for_pay
      )
        section.value = tablesEnum.bills_components;
      break;

    case tablesEnum.license:
      if (!navigationStore.selectedRow) {
        section.value = tablesEnum.license_types;
        ModalManager.getInstance().open(AddEntity, {
          sectionName: section.value,
          onClose: () => ModalManager.getInstance().closeModal(),
          onSuccess: onUpdateCallBack,
        });
      }
      if (
        navigationStore.selectedRow?.data?.nodeType === tablesEnum.license_types
      ) {
        section.value = tablesEnum.license;
        ModalManager.getInstance().open(AddLicenses, {
          sectionName: section.value,
          onClose: () => ModalManager.getInstance().closeModal(),
          onSuccess: onUpdateCallBack,
        });
      }
      break;

    case tablesEnum.shipments:
      section.value = tablesEnum.shipments;
      ModalManager.getInstance().open(AddShipments, {
        sectionName: section.value,
        onClose: () => ModalManager.getInstance().closeModal(),
        onSuccess: onUpdateCallBack,
      });

      break;

    case tablesEnum.components:
      section.value = tablesEnum.components;
      ModalManager.getInstance().open(AddModalWithImages, {
        sectionName: section.value,
        onClose: () => ModalManager.getInstance().closeModal(),
        onSuccess: onUpdateCallBack,
      });
      break;

    default:
      section.value = navigationStore.currentSection;
      break;
  }

  if (
    currentSection.value !== "employees" &&
    currentSection.value !== "license" &&
    currentSection.value !== "shipments" &&
    currentSection.value !== "stands" &&
    currentSection.value !== "stand_tasks" &&
    currentSection.value !== "organizations" &&
    currentSection.value !== "components"
  )
    ModalManager.getInstance().open(AddEntity, {
      sectionName: section.value,
      onClose: () => ModalManager.getInstance().closeModal(),
      onSuccess: onUpdateCallBack,
    });
}
