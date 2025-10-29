// shared/utils/textTemplates.ts
interface ConfirmTextTemplates {
  delete: string;
}

const entityTemplates: Record<string, ConfirmTextTemplates> = {
  shipments: {
    delete: "удалить отгрузку",
  },
  arrival_invoices: {
    delete: "удалить накладную",
  },
  invoices_components: {
    delete: "удалить компонент накладной",
  },
  order_requests: {
    delete: "удалить заказ",
  },
  bills_for_pay: {
    delete: "удалить счет",
  },
  employees: {
    delete: "удалить сотрудника",
  },
  organizations: {
    delete: "удалить организацию",
  },
  license: {
    delete: "удалить лицензию",
  },
  stands: {
    delete: "удалить стенд",
  },
  stand_tasks: {
    delete: "удалить задачу стенда",
  },
  current_tasks: {
    delete: "удалить текущую задачу",
  },
  current_tasks_states: {
    delete: "удалить состояние текущей задачи",
  },
  components: {
    delete: "удалить компонент",
  },
  component_placements: {
    delete: "удалить размещение компонента",
  },
  writeoff: {
    delete: "удалить списание",
  },
  inventarization: {
    delete: "удалить инвентаризацию",
  },
  pcb_orders: {
    delete: "удалить заказ печатной платы",
  },
  pcbs: {
    delete: "удалить печатную плату",
  },
  pcbs_components: {
    delete: "удалить компонент печатной платы",
  },
  user: {
    delete: "удалить пользователя",
  },
  current_task_states_log: {
    delete: "удалить лог состояния текущих задач",
  },
  default: {
    delete: "удалить запись",
  },
};

export const getConfirmText = (
  section: string,
  action: keyof ConfirmTextTemplates
): string => {
  const template = entityTemplates[section] || entityTemplates.default;
  return `Вы действительно хотите ${template[action].toLowerCase()}?`;
};
