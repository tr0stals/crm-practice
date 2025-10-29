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
  professions?: string[]; // 👈 добавляем сюда профессии
  children?: IMenuEntity[];
}

/**
 * Хелпер: получить список профессий, которым доступна таблица
 */
function getProfessionsForTable(tableName: string): string[] {
  return roleTables
    .filter((role) => role.tables.includes(tableName))
    .map((role) => role.profession);
}

// Базовое меню
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
        title: "Менеджер сотрудников наших компаний",
        children: [
          {
            title: "Сотрудники",
            tableName: "employees",
            professions: getProfessionsForTable("employees"),
          },
          {
            title: "Отделы",
            tableName: "departments",
            professions: getProfessionsForTable("departments"),
          },
          {
            title: "Профессии",
            tableName: "professions",
            professions: getProfessionsForTable("professions"),
          },
        ],
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
            tableName: "current_tasks_states",
            professions: getProfessionsForTable("current_tasks_states"),
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
        title: "Приход / расход",
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
        title: "Менеджер ПП",
        children: [
          {
            title: "Печатные платы",
            tableName: "pcbs",
            professions: getProfessionsForTable("pcbs"),
          },
          {
            title: "Компоненты ПП",
            tableName: "pcbs_components",
            professions: getProfessionsForTable("pcbs_components"),
          },
        ],
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
        title: "Импорт / экспорт БД, таблиц. Обновление БД на будущий год",
        tableName: "",
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
