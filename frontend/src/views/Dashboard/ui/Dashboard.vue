<script setup lang="ts">
import { useAuthStore } from "@/shared/store/auth.store";
import { useRouter } from "vue-router";
import Button from "@/shared/ui/Button/ui/Button.vue";
import PlusIcon from "@/shared/ui/PlusIcon/ui/PlusIcon.vue";
import EditIcon from "@/shared/ui/EditIcon/ui/EditIcon.vue";
import DeleteIcon from "@/shared/ui/DeleteIcon/ui/DeleteIcon.vue";
import RefreshIcon from "@/shared/ui/RefreshIcon/ui/RefreshIcon.vue";
import { ModalManager } from "@/shared/plugins/modalManager";
import EditModalWindow from "@/features/EditModalWindow/ui/EditModalWindow.vue";
import type { IEdittingProps } from "@/shared/config/IEdittingProps";
import { getUserInfoAsync } from "../api/getUserInfoAsync";
import CustomTreeview from "@/shared/ui/CustomTreeview/ui/CustomTreeview.vue";
import {
  ref,
  onMounted,
  onUnmounted,
  reactive,
  watch,
  type Ref,
  computed,
  nextTick,
} from "vue";
import "../style.scss";
import type { IData } from "../interface/IData";
import { getUsers } from "@/shared/api/userApi";
import { deleteDataAsync } from "../api/deleteDataAsync";
import AvatarIcon from "@/shared/ui/AvatarIcon/ui/AvatarIcon.vue";
import AddEntity from "@/features/AddEntity/ui/AddEntityModal.vue";
import type { TreeNode } from "primevue/treenode";
import { useGetTreeviewData } from "@/shared/ui/CustomTreeview/model/useGetTreeviewData";
import * as XLSX from "xlsx";
import { getDataAsync } from "@/shared/api/getDataAsync";
import type { IAuthorizedUser } from "../interface/IAuthorizedUser";
import { roleTables } from "@/shared/config/rolesTables";
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import { item } from "@primeuix/themes/aura/breadcrumb";
import ComponentsTreeView from "@/views/Pages/ComponentsTreeview/ui/ComponentsTreeView.vue";
import EmployeesTreeView from "@/views/Pages/EmployeesTreeview/ui/EmployeesTreeView.vue";
import OrganizationsTreeView from "@/views/Pages/OrganizationsTreeview/ui/OrganizationsTreeView.vue";
import LicenseTypesTreeView from "@/views/Pages/LicenseTypesTreeview/ui/LicenseTypesTreeView.vue";
import DepartmentsTreeView from "@/views/Pages/DepartmentsTreeview/ui/DepartmentsTreeView.vue";
import CurrentTasksTreeView from "@/views/Pages/CurrentTasksTreeview/ui/CurrentTasksTreeView.vue";
import WarehouseComponentsTreeView from "@/views/Pages/WarehouseComponentsTreeview/ui/WarehouseComponentsTreeView.vue";
import UsersTreeView from "@/views/Pages/UsersTreeview/ui/UsersTreeView.vue";
import PcbOrdersTreeView from "@/views/Pages/PcbOrdersTreeview/ui/PcbOrdersTreeView.vue";
import OrderRequestsTreeView from "@/views/Pages/OrderRequestsTreeview/ui/OrderRequestsTreeView.vue";
import PcbsTreeview from "@/views/Pages/PcbsTreeview/ui/PcbsTreeview.vue";

// TODO: сделать рефакторинг. Перенести бизнес-логику в DashboardModel.ts

const authStore = useAuthStore();
const router = useRouter();

/**
 * Данные, которые отображаются в таблице
 */
const data = ref<any[]>([]);
const isMenuOpen = ref(false);
const authorizedUser = ref<IAuthorizedUser | null>(null);

const userFirstName = ref("[First name]");
const userLastName = ref("[Last name]");
const userProfession = ref<string>("");
const avatarImage = ref(""); // Переменная для изображения аватара, изначально пустая
// const userInfo = ref<any>();
const localizatedSections = ref<any>([]);

const treeviewData = ref<TreeNode[]>([]);

const selectedRow = ref<any | null>(null);

/**
 * Наполняем этот массив по ходу
 */
const sectionsList = ref<any[]>([]);
/**
 * Текущая секция
 */
const currentSection = ref("");
const targetData = ref();

// Поисковый запрос для фильтрации
const searchQuery = ref("");

const currentPage = ref(1);
const itemsPerPage = ref<number | null>(13); // Изменено на 13, чтобы быть по умолчанию

const isSelectOpen = ref(false); // Добавляем реактивную переменную для отслеживания состояния select

// --- Фильтры по столбцам ---

const columnFilters = ref<Record<string, string | null>>({});
const filterDropdownOpen = ref<Record<string, boolean>>({});

function toggleFilterDropdown(col: string) {
  // Закрыть все фильтры кроме текущего
  Object.keys(filterDropdownOpen.value).forEach((k) => {
    filterDropdownOpen.value[k] = false;
  });
  // Открыть текущий (всегда)
  filterDropdownOpen.value[col] = true;
}
function closeFilterDropdown(col: string) {
  filterDropdownOpen.value[col] = false;
}
function setColumnFilter(col: string, value: string | null) {
  columnFilters.value[col] = value;
}
function resetColumnFilter(col: string) {
  columnFilters.value[col] = null;
  filterDropdownOpen.value[col] = false;
}

const filteredData = computed(() => {
  let result = data.value;
  for (const [col, val] of Object.entries(columnFilters.value)) {
    if (val) {
      result = result.filter((row) => {
        const cell = row[col];
        if (cell == null) return false;
        let cellValue = cell;
        if (typeof cell === "object") {
          if ("name" in cell) cellValue = cell.name;
          else if ("title" in cell) cellValue = cell.title;
          else if ("birthDate" in cell) cellValue = cell.birthDate;
          else cellValue = Object.values(cell)[0];
        }
        return String(cellValue)
          .toLowerCase()
          .includes(String(val).toLowerCase());
      });
    }
  }
  // Поиск по строке (старый фильтр)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((item) => {
      return Object.values(item).some((value) => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      });
    });
  }
  // Сортировка по id
  return [...result].sort((a, b) => {
    if (typeof a.id === "number" && typeof b.id === "number") {
      return a.id - b.id;
    } else if (typeof a.id === "string" && typeof b.id === "string") {
      return a.id.localeCompare(b.id);
    }
    return 0;
  });
});

// Вычисляемое свойство для данных текущей страницы
const paginatedData = computed(() => {
  const actualItemsPerPage = itemsPerPage.value ?? 13; // Используем 13, если itemsPerPage равно null
  const startIndex = (currentPage.value - 1) * actualItemsPerPage;
  const endIndex = startIndex + actualItemsPerPage;
  const result = filteredData.value.slice(startIndex, endIndex);
  console.debug(
    `paginatedData for ${currentSection.value} (page ${currentPage.value}):`,
    result
  );
  return result;
});

// Вычисляемое свойство для общего количества страниц
const totalPages = computed(() => {
  const actualItemsPerPage = itemsPerPage.value ?? 13; // Используем 13, если itemsPerPage равно null
  return Math.ceil(filteredData.value.length / actualItemsPerPage);
});

const showTableContainer = ref(true);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const getSectionList = async () => {
  const cfg: IData = {
    endpoint: "localization/tables",
  };

  return await getDataAsync(cfg).then((res) => (sectionsList.value = res.data));
};

const logout = () => {
  authStore.logout();
  router.push("/login");
};

const getCurrentData = async () => {
  const config: IData = {
    endpoint: `/${currentSection.value.replace(/-/g, "_")}/generateData`,
  };
  console.debug(currentSection.value);
  console.debug(config);

  data.value = []; // Очищаем данные перед загрузкой

  try {
    const response = await getDataAsync(config);
    console.debug(response);
    if (Array.isArray(response.data)) {
      data.value = response.data;
    } else {
      console.warn(
        "API returned non-array data for current section",
        response.data
      );
    }
  } catch (e) {
    console.error(e);
    data.value = []; // Убедимся, что данные пустые в случае ошибки
  }
  console.debug(`getCurrentData for ${currentSection.value}:`, data.value);
};

const onUpdateCallBack = async () => {
  await getCurrentData();
};

/**
 *  Эта функция должна срабатывать при клике на кнопку "Редактировать"
 *  или при двойном клике на ячейку в таблице.
 */
const handleEditModalWindow = () => {
  const cfg: IEdittingProps = {
    sectionName: currentSection.value,
    entityId: targetData.value.id,
  };

  if (!cfg.entityId) {
    alert("Выберите строку для редактирования");
    return;
  }

  ModalManager.getInstance().open(EditModalWindow, {
    config: cfg,
    onApplyCallback: onUpdateCallBack,
  });
};

const currentDateTime = ref("");

const updateTime = () => {
  const now = new Date();
  currentDateTime.value = now.toLocaleString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

let timer: ReturnType<typeof setInterval> | undefined;

onMounted(async () => {
  // new DashboardModel();
  getSectionList();

  const { user } = await getUserInfoAsync();
  authorizedUser.value = {
    user: user,
  };

  if (user) {
    userFirstName.value = user.employees.peoples.firstName;
    userLastName.value = user.employees.peoples.lastName;
    userProfession.value = user.employeeProfession.professions.title;
  }

  console.debug("User", user);
  console.debug(sectionsList.value);

  updateTime();
  timer = setInterval(updateTime, 1000);
  document.addEventListener("click", handleClickOutside);

  const localizationResponse = await getDataAsync({
    endpoint: "localization/tables",
  });

  localizatedSections.value = Object.fromEntries(
    Object.entries(localizationResponse.data)
  );

  console.debug(localizatedSections.value);

  const tables = roleTables
    .filter((item) => item.profession === userProfession.value)
    .map((item) => item.tables)
    .flat();

  sectionsList.value = tables;
  sectionsList.value = sectionsList.value.map((item) => {
    return item;
  });
});

watch(currentSection, async (oldVal: string, newSection: string) => {
  selectedRow.value = null;
  targetData.value = null;
  treeviewData.value = [];
  currentPage.value = 1;

  showTableContainer.value = false;
  await nextTick();
  await getCurrentData();
  showTableContainer.value = true;
  console.debug(
    `Section changed to ${newSection}. Data after update:`,
    data.value
  );
});

watch(selectedRow, (newVal) => {
  targetData.value = newVal;
});

watch(itemsPerPage, () => {
  currentPage.value = 1;
});

const currentTableHeaders = computed(() => {
  if (data.value && data.value.length > 0) {
    return Object.keys(data.value[0]).filter((key) => key !== "password");
  }
  switch (currentSection.value.toLowerCase()) {
    case "components":
      return ["id", "name", "description"];
    case "countries":
      return ["id", "name", "code"];
    case "departments":
      return ["id", "name"];
    case "invoices_arrival":
      return ["id", "invoiceNumber", "date"];
    case "license":
      return ["id", "licenseCode", "userId"];
    case "organizations":
      return ["id", "name", "organizationTypeId"];
    case "users":
      return ["id", "firstName", "lastName", "email"];
    default:
      return ["id", "name"];
  }
});

const columnCount = computed(() => {
  return currentTableHeaders.value.length;
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer); // Очищаем интервал при размонтировании компонента
  }
  document.removeEventListener("click", handleClickOutside);
});

function handleClickOutside(event: MouseEvent) {
  const filterPopups = document.querySelectorAll(".column-filter-popup");
  let inside = false;
  filterPopups.forEach((popup) => {
    if (popup.contains(event.target as Node)) inside = true;
  });
  if (!inside) {
    Object.keys(filterDropdownOpen.value).forEach((k) => {
      filterDropdownOpen.value[k] = false;
    });
  }
}

function handleSelectRow(item: any) {
  console.debug(item);
  selectedRow.value = item;
}

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target && target.files) {
    const file = target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarImage.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
};

// Функция для обновления списка пользователей
const refreshUsers = async () => {
  if (currentSection.value === "Users") {
    try {
      const response = await getUsers();
      data.value = response.data;
      selectedRow.value = null;
    } catch (e) {
      console.error(e);
    }
  }
};

// Функция для удаления пользователя
const handleDeleteRow = async () => {
  if (!selectedRow.value || !selectedRow.value.id) {
    alert("Выберите пользователя для удаления");
    return;
  }

  try {
    console.debug(currentSection.value);
    await deleteDataAsync(selectedRow.value.id, currentSection.value);
    getCurrentData();
  } catch (e) {
    alert("Ошибка при удалении пользователя");
    console.error(e);
  }
};

const handleCreateModalWindow = () => {
  // в конфиг добавляем название секции
  const cfg = {
    sectionName: currentSection.value,
    endpoint: `${currentSection.value}/create`,
  };

  if (!cfg.sectionName) {
    alert("Выберите таблицу для добавления!");
    return;
  }

  ModalManager.getInstance().open(AddEntity, {
    sectionName: currentSection.value,
    onClose: () => ModalManager.getInstance().closeModal(),
    onSuccess: getCurrentData,
  });
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const firstPage = () => {
  currentPage.value = 1;
};

const gotoPage = (page: number) => {
  currentPage.value = page;
};

const lastPage = () => {
  currentPage.value = totalPages.value;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const handleClick = (node: any) => {
  selectedRow.value = node.data;
};

const exportToCSV = () => {
  const headers = Object.keys(filteredData.value[0]).join(",");
  const rows = filteredData.value.map((row) =>
    Object.values(row)
      .map((value) => {
        // Экранирование значений для CSV:
        // если значение содержит запятую, кавычки или перевод строки,
        // заключаем его в двойные кавычки и удваиваем внутренние двойные кавычки.
        if (value === null || value === undefined) {
          return "";
        }
        let stringValue = String(value);
        if (
          stringValue.includes(",") ||
          stringValue.includes('"') ||
          stringValue.includes("\n") ||
          stringValue.includes("\r")
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(",")
  );

  const csvContent = "\uFEFF" + [headers, ...rows].join("\n"); // Добавляем BOM для корректного отображения кириллицы
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToExcel = () => {
  if (!filteredData.value.length) {
    alert("Нет данных для экспорта.");
    return;
  }

  const header = Object.keys(filteredData.value[0]);
  const data = filteredData.value.map((row) =>
    header.reduce((obj: Record<string, any>, key) => {
      obj[key] = row[key];
      return obj;
    }, {})
  );

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "data.xlsx");
};

const openAddEntityModal = () => {
  ModalManager.getInstance().open(AddEntity, {
    onApplyCallback: onUpdateCallBack,
  });
};

const filteredTreeData = computed(() => {
  if (!searchQuery.value) return data.value;
  const q = searchQuery.value.toLowerCase();
  return data.value.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(q)
  );
});

function handleSidebarClick(section: string) {
  if (!section) return;

  const lower = section.toLowerCase();
  if (lower === "employees") {
    router.push("/employees");
  } else if (lower === "organizations") {
    router.push("/organizations");
  } else if (lower === "components" || lower === "компоненты") {
    router.push("/components");
  } else if (
    lower === "user" ||
    lower === "users" ||
    lower === "пользователи"
  ) {
    router.push("/users");
  } else if (
    lower === "license_types" ||
    lower === "license types" ||
    lower === "типы лицензий"
  ) {
    router.push("/license_types");
  } else if (
    lower === "warehouse_components" ||
    lower === "warehouse components" ||
    lower === "компоненты склада"
  ) {
    router.push("/warehouse_components");
  } else if (
    lower === "pcb_orders" ||
    lower === "pcb-orders" ||
    lower === "заказы печатных плат"
  ) {
    router.push("/pcb-orders");
  } else if (
    lower === "order_requests" ||
    lower === "order-requests" ||
    lower === "заявки на заказ"
  ) {
    router.push("/order-requests");
  } else if (lower === "current_tasks" || lower === "текущие задачи") {
    router.push("/current_tasks");
  } else if (lower === "departments" || lower === "отделы") {
    router.push("/departments");
  } else {
    currentSection.value = section;
  }
}
</script>

<template>
  <!-- <CustomTreeview :data="treeviewData" /> -->

  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">А ПРАКТИКУМ</div>
      <nav class="menu">
        <ul>
          <li
            v-for="section in sectionsList"
            :data-js-sectionName="section"
            @click="currentSection = section"
          >
            {{ section }}
          </li>
        </ul>
      </nav>
      <!-- <CustomTreeview :data="data" :currentSection="currentSection" /> -->
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Header -->
      <header class="header">
        <div class="user-info">
          <AvatarIcon class="avatar" />
          <div>
            <div class="user-fullname">
              {{ userFirstName }} {{ userLastName }}
            </div>
            <div class="user-details">{{ currentDateTime }}</div>
            <div class="user-details">
              {{ userProfession }}
            </div>
          </div>
        </div>
        <button class="logout-button" @click="logout">Выйти</button>
      </header>

      <!-- Content -->
      <section class="content-section" v-if="currentSection">
        <h2 class="content-section__title">
          {{ localizatedSections[currentSection] }}
        </h2>
        <!-- Action Buttons, Search, and Filter Placeholder -->
        <div class="controls">
          <div class="action-buttons">
            <Button
              :onClick="handleCreateModalWindow"
              class="dashboard__button"
            >
              <PlusIcon /> добавить
            </Button>
            <Button :onClick="handleEditModalWindow" class="dashboard__button">
              <EditIcon /> редактировать
            </Button>
            <Button :onClick="handleDeleteRow" class="dashboard__button">
              <DeleteIcon /> удалить
            </Button>
            <Button :onClick="getCurrentData" class="dashboard__button">
              <RefreshIcon /> обновить
            </Button>
            <Button :onClick="exportToCSV" class="dashboard__button">
              выгрузить в csv</Button
            >
            <Button :onClick="exportToExcel" class="dashboard__button">
              выгрузить в excel</Button
            >
          </div>
          <div class="search-filter">
            <input
              type="text"
              placeholder="Поиск"
              class="search-input"
              v-model="searchQuery"
            />
          </div>
        </div>

        <!-- Table -->
        <div class="table-container" v-if="showTableContainer">
          <template v-if="currentSection === 'warehouse_components'">
            <WarehouseComponentsTreeView :handle-select-callback="handleSelectRow" :search="searchQuery" />
          </template>
          <template v-else-if="currentSection === 'employees'">
            <EmployeesTreeView :handle-select-callback="handleSelectRow" :search="searchQuery" />
          </template>
          <template v-else-if="currentSection === 'organizations'">
            <OrganizationsTreeView :handle-select-callback="handleSelectRow" :search="searchQuery" />
          </template>
          <template v-else-if="currentSection === 'licenseTypes'">
            <LicenseTypesTreeView :handle-select-callback="handleSelectRow" :search="searchQuery" />
          </template>
          <template v-else-if="currentSection === 'current-tasks'">
            <CurrentTasksTreeView :handle-select-callback="handleSelectRow" :search="searchQuery" />
          </template>
          <template v-else-if="currentSection === 'components'">
            <ComponentsTreeView :handle-select-callback="handleSelectRow" :search="searchQuery" />
          </template>
          <template v-else-if="currentSection === 'user'">
            <UsersTreeView :handle-select-callback="handleSelectRow" :search="searchQuery" />
          </template>
          <template v-else-if="currentSection === 'pcb-orders'">
            <PcbOrdersTreeView :handle-select-callback="handleSelectRow" :search="searchQuery" />
          </template>
          <template v-else-if="currentSection === 'order-requests'">
            <OrderRequestsTreeView :handle-select-callback="handleSelectRow" :search="searchQuery" />
          </template>
          <template v-else-if="currentSection === 'pcbs'">
            <PcbsTreeview :handle-select-callback="handleSelectRow" :search="searchQuery" />
          </template>
          <table v-else :key="currentSection + '-table'" class="data-table">
            <thead>
              <tr>
                <th
                  v-for="key in currentTableHeaders"
                  :key="key"
                  style="position: relative"
                >
                  {{ key }}
                  <button
                    @click.stop="toggleFilterDropdown(key)"
                    style="margin-left: 4px; cursor: pointer"
                  >
                    &#x1F50D;
                  </button>
                  <div
                    v-if="filterDropdownOpen[key]"
                    :key="key"
                    class="column-filter-popup"
                    style="
                      position: absolute;
                      z-index: 10;
                      background: #fff;
                      border: 1px solid #ccc;
                      padding: 8px;
                      min-width: 180px;
                      max-width: 300px;
                      max-height: 200px;
                      overflow: auto;
                    "
                  >
                    <button
                      @click.stop="closeFilterDropdown(key)"
                      style="
                        position: absolute;
                        top: 4px;
                        right: 4px;
                        font-size: 18px;
                        background: none;
                        border: none;
                        cursor: pointer;
                      "
                    >
                      &times;
                    </button>
                    <div style="margin-bottom: 4px; font-weight: bold">
                      Поиск по столбцу
                    </div>
                    <input
                      v-model="columnFilters[key]"
                      @input="setColumnFilter(key, columnFilters[key])"
                      @click.stop
                      type="text"
                      :placeholder="'Поиск по ' + key"
                      style="width: 100%; margin-bottom: 8px"
                      autofocus
                    />
                    <div style="margin-top: 6px">
                      <button
                        @click="resetColumnFilter(key)"
                        style="font-size: 12px"
                      >
                        Сбросить
                      </button>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedData.length === 0">
                <td :colspan="columnCount">Нет данных для отображения.</td>
              </tr>
              <tr
                v-else
                v-for="(item, index) in paginatedData"
                :data-js-section-data="JSON.stringify(item)"
                :key="item.id || index"
                @click="selectedRow = item"
                @dblclick="handleEditModalWindow"
                :class="{
                  'selected-row': String(selectedRow?.id) === String(item.id),
                }"
              >
                <template v-for="(value, title) in item">
                  <td v-if="title !== 'password'" :key="title">
                    <template v-if="typeof value === 'boolean'">
                      <input type="checkbox" :checked="value" disabled />
                    </template>
                    <template v-else>
                      {{ value }}
                    </template>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <Button @click="currentPage--" :disabled="currentPage === 1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-chevron-left"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </Button>
          <span>Страница {{ currentPage }} из {{ totalPages }}</span>
          <Button @click="currentPage++" :disabled="currentPage === totalPages">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-chevron-right"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Button>
          <div class="items-per-page">
            <label for="itemsPerPage">Элементов на странице:</label>
            <div class="select-wrapper" :class="{ open: isSelectOpen }">
              <select
                id="itemsPerPage"
                v-model="itemsPerPage"
                @focus="isSelectOpen = true"
                @blur="isSelectOpen = false"
                @change="
                  isSelectOpen = false;
                  currentPage = 1;
                "
              >
                <option :value="null"></option>
                <option :value="5">5</option>
                <option :value="15">15</option>
                <option :value="35">35</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      <section v-else class="welcome-container">
        <div class="welcome-card">
          <img
            src="/src/views/Dashboard/img/ukqawu62wctf9v072xi2c6yypvsjghcp.png"
            alt="Логотип"
            class="welcome-logo"
          />
          <h1 class="welcome-message-part1">Добро пожаловать!</h1>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Стили для приветственного сообщения */
.welcome-message-part1 {
  text-align: center;
  color: #0056b3; /* Изменен на #0056b3 */
  font-size: 38px; /* Еще увеличенный размер шрифта */
  font-weight: 800; /* Более жирный шрифт */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* Немного более выраженная тень */
  animation: fadeIn 2s ease-in-out; /* Убираю задержку анимации */
  letter-spacing: 1px; /* Немного увеличенный межбуквенный интервал */
}

.welcome-logo {
  display: block;
  margin: 0 auto; /* Убираю все внешние отступы, кроме горизонтального центрирования */
  max-width: 200px; /* Увеличенная максимальная ширина для логотипа */
  height: auto;
  animation: fadeIn 2s ease-in-out; /* Добавляю анимацию плавного появления */
  filter: drop-shadow(
    0px 7px 10px rgba(0, 0, 0, 0.35)
  ); /* Более выраженная тень для логотипа */
}

.welcome-container {
  flex-grow: 1; /* Растягивает контейнер на всю доступную высоту */
  display: flex;
  justify-content: center; /* Центрирует содержимое по горизонтали */
  align-items: stretch; /* Растягивает содержимое по вертикали */
  padding: 20px; /* Небольшой отступ со всех сторон внутри контейнера */
}

.welcome-card {
  background-color: #ffffff; /* Белый фон плашки */
  border-radius: 15px; /* Скругленные углы */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); /* Более выраженная тень */
  padding: 40px; /* Увеличенные отступы внутри плашки */
  width: 100%; /* Занимает всю доступную ширину родителя */
  height: 100%; /* Занимает всю доступную высоту родителя */
  margin: 0; /* Удаляем внешние отступы, так как padding контейнера их заменит */
  display: flex; /* Делаем плашку флекс-контейнером */
  flex-direction: column; /* Элементы располагаются в столбец */
  align-items: center; /* Выравниваем элементы по горизонтали по центру */
  justify-content: center; /* Выравниваем элементы по вертикали по центру */
  transform: translateY(
    -2%
  ); /* Сдвигаем плашку чуть выше для визуального центрирования */
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px); /* Небольшое смещение для эффекта */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #0056b3; /* Изменен на #0056b3 */
}
</style>
