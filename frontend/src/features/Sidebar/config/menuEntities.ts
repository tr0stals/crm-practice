import docsIcon from "../../../../public/assets/DocsIcon.png";
import orgIcon from "../../../../public/assets/OrganizationsIcon.png";
import licenseIcon from "../../../../public/assets/LicencesIcon.png";
import shipmentIcon from "../../../../public/assets/ShipmentsIcon.png";
import warehouseIcon from "../../../../public/assets/WarehouseIcon.png";
import pcbIcon from "../../../../public/assets/PcbsIcon.png";
import standIcon from "../../../../public/assets/StandsIcon.png";
import systemIcon from "../../../../public/assets/SystemIcon.png";
import { roleTables } from "@/shared/config/rolesTables";

interface IMenuEntity {
  icon?: string;
  title: string;
  tableName?: string;
  professions?: string[];
  children?: IMenuEntity[];
}

/**
 * Функция получает список профессий, которым доступна таблица
 */
function getProfessionsForTable(tableName: string): string[] {
  console.debug(tableName);
  return roleTables
    .filter((role) => role.tables.includes(tableName))
    .map((role) => role.profession);
}

export const menuEntities: IMenuEntity[] = [
  {
    icon: `${docsIcon}`,
    title: "Документы",
    children: [
      {
        title: "Менеджер накладных",
        tableName: "arrival_invoices",
        professions: getProfessionsForTable("arrival_invoices"),
      },
      {
        title: "Менеджер счетов",
        tableName: "bills_for_pay",
        professions: getProfessionsForTable("bills_for_pay"),
      },
      {
        title: "Заявки на заказ",
        tableName: "order_requests",
        professions: getProfessionsForTable("order_requests"),
      },
    ],
  },
  {
    icon: `${orgIcon}`,
    title: "Организации",
    children: [
      {
        title: "Менеджер организаций",
        tableName: "organizations",
        professions: getProfessionsForTable("organizations"),
      },
      {
        title: "Менеджер сотрудников ",
        tableName: "employees",
        professions: getProfessionsForTable("employees"),
      },
      {
        title: "Люди ",
        tableName: "peoples",
        professions: getProfessionsForTable("peoples"),
      },
    ],
  },
  {
    icon: licenseIcon,
    title: "Лицензии",
    tableName: "license",
    professions: getProfessionsForTable("license"),
  },
  {
    icon: standIcon,
    title: "Стенды",
    children: [
      {
        title: "Стенды",
        tableName: "stands",
        professions: getProfessionsForTable("stands"),
      },
      {
        title: "Техпроцесс",
        tableName: "stand_tasks",
        professions: getProfessionsForTable("stand_tasks"),
      },
    ],
  },
  {
    icon: shipmentIcon,
    title: "Отгрузки",
    children: [
      {
        title: "Отгрузки",
        tableName: "shipments",
        professions: getProfessionsForTable("shipments"),
      },
      {
        title: "Текущие задачи",
        children: [
          {
            title: "Текущие задачи",
            tableName: "current_tasks",
            professions: getProfessionsForTable("current_tasks"),
          },
          {
            title: "Состояния текущих задач",
            tableName: "current_task_states",
            professions: getProfessionsForTable("current_task_states"),
          },
        ],
      },
    ],
  },
  {
    icon: warehouseIcon,
    title: "Склад",
    children: [
      {
        title: "Компоненты склада",
        children: [
          {
            title: "Компоненты",
            tableName: "components",
            professions: getProfessionsForTable("components"),
          },
          {
            title: "Размещение компонентов",
            tableName: "component_placements",
            professions: getProfessionsForTable("component_placements"),
          },
        ],
      },
      {
        title: "Списания",
        tableName: "writeoff",
        professions: getProfessionsForTable("writeoff"),
      },
      {
        title: "Инвентаризация",
        tableName: "inventarization",
        professions: getProfessionsForTable("inventarization"),
      },
    ],
  },
  {
    icon: pcbIcon,
    title: "Печатные платы",
    children: [
      {
        title: "Заказы ПП",
        tableName: "pcb_orders",
        professions: getProfessionsForTable("pcb_orders"),
      },
      {
        title: "Печатные платы",
        tableName: "pcbs",
        professions: getProfessionsForTable("pcbs"),
      },
    ],
  },
  {
    icon: systemIcon,
    title: "Система",
    children: [
      {
        title: "Менеджер пользователей",
        tableName: "user",
        professions: getProfessionsForTable("user"),
      },
      {
        title: "Системные настройки",
        tableName: "system",
        professions: ["Администратор", "Директор"],
      },
      {
        title: "Журнал текущих задач",
        tableName: "current_task_states_log",
        professions: getProfessionsForTable("current_task_states_log"),
      },
    ],
  },
];
