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
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from "vue";
import "../style.scss";
import type { IData } from "../interface/IData";
import { getUsers } from "@/shared/api/userApi";
import { deleteDataAsync } from "../api/deleteDataAsync";
import AvatarIcon from "@/shared/ui/AvatarIcon/ui/AvatarIcon.vue";
import AddEntity from "@/features/AddEntity/ui/AddEntityModal.vue";
import type { TreeNode } from "primevue/treenode";
import * as XLSX from "xlsx";
import { getDataAsync } from "@/shared/api/getDataAsync";
import type { IAuthorizedUser } from "../interface/IAuthorizedUser";
import { roleTables } from "@/shared/config/rolesTables";
import { MoreDetailsCollapseModel } from "@/widgets/MoreDetailsCollapse/model/MoreDetailsCollapseModel";
import { useGlobalStore } from "@/shared/store/globalStore";
import { localizatedSectionsList } from "@/shared/config/localizatedSections";
import { treeviewTables } from "@/shared/config/treeviewTables";
import WelcomeBanner from "@/widgets/WelcomeBanner/ui/WelcomeBanner.vue";

const authStore = useAuthStore();
const router = useRouter();
const globalStore = useGlobalStore();

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
const treeviewRef = ref(null);

const selectedRow = ref();

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

async function getCurrentData() {
  const config: IData = {
    endpoint: `/${globalStore.currentSection}/generateData`,
  };

  try {
    const response = await getDataAsync(config);

    if (Array.isArray(response.data)) {
      // Заменяем массив реактивно
      data.value.splice(0, data.value.length, ...response.data);
    } else {
      console.warn(
        "API returned non-array data for current section",
        response.data
      );
      data.value.splice(0, data.value.length);
    }
  } catch (e) {
    console.error(e);
    data.value.splice(0, data.value.length);
  }
}

watch(selectedRow, (newVal) => {
  globalStore.setSelectedRow(newVal);
  console.debug(globalStore.selectedRow);
});

async function onUpdateCallBack() {
  await getCurrentData();
  treeviewRef.value?.refreshTree?.();
}

/**
 *  Эта функция должна срабатывать при клике на кнопку "Редактировать"
 *  или при двойном клике на ячейку в таблице.
 */
function handleEditModalWindow() {
  const cfg: IEdittingProps = {
    sectionName: globalStore.currentSection,
    entityId: globalStore.selectedRow?.id,
  };

  if (!cfg.entityId) {
    alert("Выберите строку для редактирования");
    return;
  }
  console.debug(cfg);

  ModalManager.getInstance().open(EditModalWindow, {
    config: cfg,
    onApplyCallback: onUpdateCallBack,
  });
}

watch(currentSection, (newVal) => {
  console.debug(newVal);
  globalStore.currentSection = newVal;
});

// watch(
//   () => globalStore.activeSection,
//   (section: string) => {
//     currentSection.value = section;
//   }
// );

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

  updateTime();
  timer = setInterval(updateTime, 1000);
  document.addEventListener("click", handleClickOutside);

  localizatedSections.value = localizatedSectionsList;

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

watch(itemsPerPage, () => {
  currentPage.value = 1;
});

const currentTableHeaders = computed(() => {
  if (data.value && data.value.length > 0) {
    return Object.keys(data.value[0]).filter((item) => item !== "id");
  }
  // switch (currentSection.value.toLowerCase()) {
  //   case "components":
  //     return ["id", "name", "description"];
  //   case "countries":
  //     return ["id", "name", "code"];
  //   case "departments":
  //     return ["id", "name"];
  //   case "invoices_arrival":
  //     return ["id", "invoiceNumber", "date"];
  //   case "license":
  //     return ["id", "licenseCode", "userId"];
  //   case "organizations":
  //     return ["id", "name", "organizationTypeId"];
  //   case "users":
  //     return ["id", "firstName", "lastName", "email"];
  //   default:
  //     return ["id", "name"];
  // }
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
  if (!globalStore.selectedRow || !globalStore.selectedRow?.id) {
    alert("Выберите запись для удаления");
    return;
  }

  console.debug(globalStore.selectedRow, globalStore.selectedRow?.id);

  try {
    await deleteDataAsync(globalStore.selectedRow?.id, currentSection.value);
    getCurrentData();
  } catch (e) {
    alert("Ошибка при удалении записи");
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

const handleMoreDetails = () => {
  if (!selectedRow.value) {
    alert("Необходимо выбрать строку");
    return;
  }

  if (!currentSection.value) {
    alert("Необходимо выбрать таблицу!");
    return;
  }

  const config = {
    selectedRow: selectedRow.value,
    currentSection: currentSection.value,
  };

  MoreDetailsCollapseModel.getInstance(config);
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

const filteredTreeData = computed(() => {
  if (!searchQuery.value) return data.value;
  const q = searchQuery.value.toLowerCase();
  return data.value.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(q)
  );
});
</script>

<template>
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
            {{ localizatedSectionsList[section] }}
          </li>
          <template
            v-if="userProfession === 'Снабженец' || userProfession === 'Test'"
          >
            <li @click="currentSection = 'warehouse_components'">Склад</li>
          </template>
        </ul>
      </nav>
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
      <section
        data-js-content-section
        class="content-section"
        v-if="currentSection"
      >
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
            <Button
              id="deleteButton"
              :onClick="handleDeleteRow"
              class="dashboard__button"
            >
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
            <Button
              v-if="
                currentSection === 'bills_for_pay' ||
                currentSection === 'arrival_invoices'
              "
              :onclick="handleMoreDetails"
            >
              Подробнее
            </Button>
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
          <!-- Если текущая секция находится в массиве treeviewTables - значит отображаем Treeview -->
          <template v-if="treeviewTables.includes(currentSection)">
            <CustomTreeview
              ref="treeviewRef"
              :current-section="currentSection"
              :handle-select-callback="handleSelectRow"
            />
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
                  <td
                    v-if="title !== 'password' && title !== 'id'"
                    :key="title"
                  >
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
      <template v-else>
        <WelcomeBanner />
      </template>
    </main>
  </div>
</template>
