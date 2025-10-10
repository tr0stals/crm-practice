import docsIcon from "../../../../public/assets/DocsIcon.png";
import orgIcon from "../../../../public/assets/OrganizationsIcon.png";
import licenseIcon from "../../../../public/assets/LicencesIcon.png";
import shipmentIcon from "../../../../public/assets/ShipmentsIcon.png";
import warehouseIcon from "../../../../public/assets/WarehouseIcon.png";
import pcbIcon from "../../../../public/assets/PcbsIcon.png";
import standIcon from "../../../../public/assets/StandsIcon.png";
import systemIcon from "../../../../public/assets/SystemIcon.png";

interface IMenuEntity {
  icon?: string;
  title: string;
  tableName?: string;
  children?: IMenuEntity[];
}

export const menuEntities: IMenuEntity[] = [
  {
    icon: `${docsIcon}`,
    title: "Документы",
    children: [
      {
        icon: "",
        title: "Менеджер накладных",
        tableName: "arrival_invoices",
      },
      {
        icon: "",
        title: "Менеджер счетов",
        tableName: "bills_for_pay",
      },
      {
        icon: "",
        title: "Заявки на заказ",
        tableName: "order_requests",
      },
    ],
  },
  {
    icon: `${orgIcon}`,
    title: "Организации",
    children: [
      {
        icon: "",
        title: "Менеджер организаций",
        tableName: "organizations",
      },
      {
        icon: "",
        title: "Менеджер сотрудников наших компаний",
        children: [
          {
            icon: "",
            title: "Сотрудники",
            tableName: "employees",
          },
          {
            icon: "",
            title: "Отделы",
            tableName: "departments",
          },
          {
            icon: "",
            title: "Профессии",
            tableName: "professions",
          },
        ],
      },
    ],
  },
  {
    icon: licenseIcon,
    title: "Лицензии",
    tableName: "license",
    children: [],
  },
  {
    icon: standIcon,
    title: "Стенды",
    children: [
      {
        icon: "",
        title: "Стенды",
        tableName: "stands",
      },
      {
        icon: "",
        title: "Техпроцесс",
        tableName: "stand_tasks",
      },
    ],
  },
  {
    icon: shipmentIcon,
    title: "Отгрузки",
    children: [
      {
        icon: "",
        title: "Отгрузки",
        tableName: "shipments",
      },
      {
        icon: "",
        title: "Текущие задачи",
        children: [
          {
            icon: "",
            title: "Текущие задачи",
            tableName: "current_tasks",
          },
          {
            icon: "",
            title: "Состояния текущих задач",
            tableName: "current_task_states",
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
        icon: "",
        title: "Компоненты склада",
        children: [
          {
            icon: "",
            title: "Компоненты",
            tableName: "components",
          },
          {
            icon: "",
            title: "Размещение компонентов",
            tableName: "component_placements",
          },
        ],
      },
      {
        icon: "",
        title: "Приход / расход",
        tableName: "",
      },
      {
        icon: "",
        title: "Инвентаризация",
        tableName: "inventarization",
      },
    ],
  },
  {
    icon: pcbIcon,
    title: "Печатные платы",
    children: [
      {
        icon: "",
        title: "Заказы ПП",
        tableName: "pcb_orders",
      },
      {
        icon: "",
        title: "Менеджер ПП",
        children: [
          {
            icon: "",
            title: "Печатные платы",
            tableName: "pcbs",
          },
          {
            icon: "",
            title: "Компоненты ПП",
            tableName: "pcbs_components",
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
        icon: "",
        title: "Менеджер пользователей",
        tableName: "user",
      },
      {
        icon: "",
        title: "Импорт / экспорт БД, таблиц. Обновление БД на будущий год",
        tableName: "",
      },
      {
        icon: "",
        title: "Журнал текущих задач",
        tableName: "current_task_states_log",
      },
    ],
  },
];
