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
import { localizatedSectionsList } from "@/shared/config/localizatedSections";
import { treeviewTables } from "@/shared/config/treeviewTables";
import WelcomeBanner from "@/widgets/WelcomeBanner/ui/WelcomeBanner.vue";
import AddCurrentTask from "@/features/AddCurrentTask/ui/AddCurrentTask.vue";
import SetCurrentTaskCompleted from "@/features/SetCurrentTaskCompleted/ui/SetCurrentTaskCompleted.vue";
import ExportTableButton from "@/features/ExportTableButton/ui/ExportTableButton.vue";
import ImportTableButton from "@/features/ImportTableButton/ui/ImportTableButton.vue";
import CustomDropdown from "@/shared/ui/CustomDropdown/ui/CustomDropdown.vue";
import ExportDatabase from "@/features/ExportDatabase/ui/ExportDatabase.vue";
import ImportDatabase from "@/features/ImportDatabase/ui/ImportDatabase.vue";
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";
import NavigationSidebar from "@/features/NavigationSidebar/ui/NavigationSidebar.vue";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import TreeviewMenu from "@/features/TreeviewMenu/ui/TreeviewMenu.vue";
import NotificationButton from "@/features/Notifications/ui/NotificationButton.vue";
import AddEmployees from "@/features/AddEntity/ui/AddEmployees.vue";
import EmployeesEditModal from "@/features/EditModalWindow/ui/EmployeesEditModal.vue";
import AddLicenses from "@/features/AddEntity/ui/AddLicenses.vue";

const authStore = useAuthStore();
const router = useRouter();
const authorizedUserStore = useAuthorizedUserStore();
const navigationStore = useNavigationStore();

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
const itemsPerPage = ref<number>(8); // Изменено на 13, чтобы быть по умолчанию

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
    endpoint: `/${navigationStore.currentSection}/generateData`,
  };
  console.debug(config);

  try {
    const response = await getDataAsync(config);
    console.debug("Response", response);

    if (Array.isArray(response.data)) {
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

watch(
  () => navigationStore.selectedRow,
  (newVal) => {
    selectedRow.value = newVal;
    console.debug("selectedRow", navigationStore.selectedRow);
  }
);

async function onUpdateCallBack() {
  await getCurrentData();
  treeviewRef.value?.refreshTree?.();
}

/**
 *  Эта функция должна срабатывать при клике на кнопку "Редактировать"
 *  или при двойном клике на ячейку в таблице.
 */
function handleEditModalWindow() {
  /*
   *  Не удалять комментарий, чтобы не забыть логику выбора sectionName!!!
   *
   *  Цель: узнать, какую текущую секцию передавать в EditModalWindow.
   *  Логика: 1. если это Treeview - тогда выбранная строка имеет объект data - следовательно, мы выбираем ..data.nodeType
   *          2. если это табличная сущность - у нее нет объекта data, следовательно, передаем navigationStore.currentSection
   *
   * Желательно не трогать, иначе можно получить ошибки при открытии модалки редактирования
   */
  const sectionName = navigationStore.selectedRow?.data
    ? navigationStore.selectedRow.data?.nodeType
    : navigationStore.currentSection;
  const entityId = navigationStore.selectedRow?.id;

  const cfg: IEdittingProps = {
    sectionName: sectionName,
    entityId: entityId,
  };
  console.debug(cfg);

  if (!cfg.entityId || !cfg.sectionName) {
    alert("Выберите строку для редактирования");

    return;
  }

  if (cfg.sectionName === "employees")
    ModalManager.getInstance().open(EmployeesEditModal, {
      config: cfg,
      onApplyCallback: onUpdateCallBack,
    });
  else {
    ModalManager.getInstance().open(EditModalWindow, {
      config: cfg,
      onApplyCallback: onUpdateCallBack,
    });
  }
}

watch(
  () => navigationStore.currentSection,
  (newVal) => {
    currentSection.value = newVal;
    console.debug(currentSection.value);
  }
);

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

  console.debug(user);
  authorizedUser.value = {
    user: user,
  };

  console.debug();
  if (user) {
    authorizedUserStore.setUser({
      id: authorizedUser.value.user?.id,
      firstName: user.employees.peoples.firstName,
      lastName: user.employees.peoples.lastName,
      professionTitle: user.employeeProfession.professions.title,
    });
  }

  console.debug(authorizedUser.value.user?.id);
  console.debug(authorizedUserStore);
  updateTime();
  timer = setInterval(updateTime, 1000);
  document.addEventListener("click", handleClickOutside);

  localizatedSections.value = localizatedSectionsList;

  const tables = roleTables
    .filter(
      (item) => item.profession === authorizedUserStore.user?.professionTitle
    )
    .map((item) => item.tables)
    .flat();

  sectionsList.value = tables;
  sectionsList.value = sectionsList.value.map((item) => {
    return item;
  });
});

watch(
  () => navigationStore.currentSection,
  async (oldVal: string, newSection: string) => {
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
  }
);

watch(itemsPerPage, () => {
  currentPage.value = 1;
});

const currentTableHeaders = computed(() => {
  if (data.value && data.value.length > 0) {
    return Object.keys(data.value[0]).filter(
      (item) => item !== "id" && item !== "parentId"
    );
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
  navigationStore.setSelectedRow(item);
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
  if (!navigationStore.selectedRow || !navigationStore.selectedRow?.id) {
    alert("Выберите запись для удаления");
    return;
  }
  console.debug(navigationStore.selectedRow);
  const targetId = navigationStore.selectedRow?.data
    ? navigationStore.selectedRow?.data?.id
    : navigationStore.selectedRow?.id;

  const targetNodeType = navigationStore.selectedRow?.data
    ? navigationStore.selectedRow?.data?.nodeType
    : navigationStore.currentSection;

  console.debug(navigationStore.selectedRow, navigationStore.selectedRow?.id);

  const response = await deleteDataAsync(targetId, targetNodeType);
  console.debug(response);

  if (response?.status === 200) {
    onUpdateCallBack();
  }
};

const handleCreateModalWindow = () => {
  // в конфиг добавляем название секции
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
    case "employees":
      if (!navigationStore.selectedRow) {
        section.value = "departments";
        ModalManager.getInstance().open(AddEntity, {
          sectionName: section.value,
          onClose: () => ModalManager.getInstance().closeModal(),
          onSuccess: onUpdateCallBack,
        });
      }

      if (navigationStore.selectedRow?.data?.nodeType === "departments") {
        section.value = "employees";
        ModalManager.getInstance().open(AddEmployees, {
          sectionName: section.value,
          onClose: () => ModalManager.getInstance().closeModal(),
          onSuccess: onUpdateCallBack,
        });
      }

      break;

    case "organizations":
      if (!navigationStore.selectedRow) section.value = "organization_types";
      if (navigationStore.selectedRow?.data?.nodeType === "organization_types")
        section.value = "organizations";
      break;

    case "arrival_invoices":
      if (!navigationStore.selectedRow) section.value = "arrival_invoices";
      if (navigationStore.selectedRow?.data?.nodeType === "arrival_invoices")
        section.value = "invoices_components";
      break;

    case "bills_for_pay":
      if (!navigationStore.selectedRow) section.value = "bills_for_pay";
      if (navigationStore.selectedRow?.data?.nodeType === "bills_for_pay")
        section.value = "bills_components";
      break;

    case "license":
      if (!navigationStore.selectedRow) {
        section.value = "license_types";
        ModalManager.getInstance().open(AddEntity, {
          sectionName: section.value,
          onClose: () => ModalManager.getInstance().closeModal(),
          onSuccess: onUpdateCallBack,
        });
      }
      if (navigationStore.selectedRow?.data?.nodeType === "license_types") {
        section.value = "license";
        ModalManager.getInstance().open(AddLicenses, {
          sectionName: section.value,
          onClose: () => ModalManager.getInstance().closeModal(),
          onSuccess: onUpdateCallBack,
        });
      }
      break;

    default:
      section.value = navigationStore.currentSection;
      break;
  }

  if (
    currentSection.value !== "employees" &&
    currentSection.value !== "license"
  )
    ModalManager.getInstance().open(AddEntity, {
      sectionName: section.value,
      onClose: () => ModalManager.getInstance().closeModal(),
      onSuccess: onUpdateCallBack,
    });
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

const filteredTreeData = computed(() => {
  if (!searchQuery.value) return data.value;
  const q = searchQuery.value.toLowerCase();

  return data.value.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(q)
  );
});

const page = ref<number>(1);
const perPage = ref<number>(9);

// При изменении количества элементов на странице скидываем текущую страницу на начальную
watch(perPage, () => {
  page.value = 1;
});

const paginatedData = computed(() => {
  const start = (page.value - 1) * perPage.value;

  // выявляем отфильтрованые данные
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

  return filteredData.value.slice(start, start + perPage.value);
});

function nextPage() {
  if (page.value < Math.ceil(filteredData.value.length / perPage.value)) {
    page.value++;
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value--;
  }
}

const dropdownConfig = [
  { component: ExportDatabase },
  { component: ImportDatabase },
];

const handleSelectSection = (item: any) => {
  navigationStore.currentSection = item.data.nodeType;
};
</script>

<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">А ПРАКТИКУМ</div>
      <!-- <NavigationSidebar :sections-list="sectionsList" /> -->

      <TreeviewMenu
        v-if="
          authorizedUserStore.user?.professionTitle === 'Администратор' ||
          authorizedUserStore.user?.professionTitle === 'Директор' ||
          authorizedUserStore.user?.professionTitle === 'Test'
        "
        @node-select="handleSelectSection"
      />
      <NavigationSidebar v-else :sections-list="sectionsList" />
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Header -->
      <header class="header">
        <div class="user-info">
          <AvatarIcon class="avatar" />
          <div>
            <div class="user-fullname">
              {{ authorizedUserStore.user?.firstName }}
              {{ authorizedUserStore.user?.lastName }}
            </div>
            <div class="user-details">{{ currentDateTime }}</div>
            <div class="user-details">
              {{ authorizedUserStore.user?.professionTitle }}
            </div>
          </div>
        </div>
        <NotificationButton />
        <div class="header__controls">
          <CustomDropdown
            v-if="
              authorizedUserStore.user?.professionTitle === 'Администратор' ||
              authorizedUserStore.user?.professionTitle === 'Директор' ||
              authorizedUserStore.user?.professionTitle === 'Test'
            "
            dropdown-title="Действия"
            :dropdown-items="dropdownConfig"
          />
          <Button @click="logout">Выйти</Button>
        </div>
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
          <div
            v-if="
              authorizedUserStore.user?.professionTitle.toLowerCase() ===
                'test' ||
              authorizedUserStore.user?.professionTitle.toLowerCase() ===
                'администратор' ||
              authorizedUserStore.user?.professionTitle.toLowerCase() ===
                'директор'
            "
            class="action-buttons"
          >
            <Button
              :class="
                navigationStore.selectedRow?.level > 2 && 'button__disabled'
              "
              :disabled="navigationStore.selectedRow?.level > 2"
              :onClick="handleCreateModalWindow"
            >
              <PlusIcon /> добавить
            </Button>
            <Button :onClick="handleEditModalWindow">
              <EditIcon /> редактировать
            </Button>
            <Button id="deleteButton" :onClick="handleDeleteRow">
              <DeleteIcon /> удалить
            </Button>
            <Button :onClick="getCurrentData">
              <RefreshIcon /> обновить
            </Button>

            <Button
              v-if="
                currentSection === 'bills_for_pay' ||
                currentSection === 'arrival_invoices'
              "
              :onclick="handleMoreDetails"
            >
              Подробнее
            </Button>
            <ExportTableButton :onSuccessCallback="onUpdateCallBack" />
            <ImportTableButton />
          </div>
          <div v-else class="action-buttons">
            <AddCurrentTask :onSuccessCallback="onUpdateCallBack" />
            <SetCurrentTaskCompleted :onSuccessCallback="onUpdateCallBack" />
          </div>
          <div class="search-filter">
            <input
              v-if="!treeviewTables.includes(currentSection)"
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
              @node-select="handleSelectRow"
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
                  {{ fieldDictionary[key] }}
                  <button
                    @click.stop="toggleFilterDropdown(key)"
                    style="margin-left: 4px; cursor: pointer"
                  >
                    &#x1F50D;
                  </button>
                  <input
                    v-if="filterDropdownOpen[key]"
                    :key="key"
                    v-model="columnFilters[key]"
                    @input="setColumnFilter(key, columnFilters[key])"
                    @click.stop
                    type="text"
                    :placeholder="'Поиск по ' + key"
                    autofocus
                  />
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
                @click="navigationStore.selectedRow = item"
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
        <div v-if="!treeviewTables.includes(currentSection)" class="pagination">
          <button
            class="pagination__btn"
            @click="prevPage"
            :disabled="page === 1"
          >
            ← Назад
          </button>
          <span class="pagination__text"
            >Страница {{ page }} из
            {{ Math.ceil(filteredData.length / perPage) }}
          </span>
          <button
            class="pagination__btn"
            @click="nextPage"
            :disabled="page === Math.ceil(filteredData.length / perPage)"
          >
            Вперёд →
          </button>
          <div class="pagination__itemsPerPage">
            <label class="pagination__itemsPerPage__label" for="itemsPerPage"
              >Элементов на странице:</label
            >
            <div
              class="pagination__itemsPerPage__selectWrapper"
              :class="{ open: isSelectOpen }"
            >
              <select
                class="pagination__itemsPerPage__selectWrapper__select"
                id="itemsPerPage"
                v-model="perPage"
                @change="
                  isSelectOpen = false;
                  currentPage = 1;
                "
              >
                <option
                  class="pagination__itemsPerPage__selectWrapper__select__option"
                  :value="9"
                ></option>
                <option
                  class="pagination__itemsPerPage__selectWrapper__select__option"
                  :value="5"
                >
                  5
                </option>
                <option
                  class="pagination__itemsPerPage__selectWrapper__select__option"
                  :value="20"
                >
                  20
                </option>
                <option
                  class="pagination__itemsPerPage__selectWrapper__select__option"
                  :value="35"
                >
                  35
                </option>
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
