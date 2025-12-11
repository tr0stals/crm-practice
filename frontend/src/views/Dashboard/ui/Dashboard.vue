<script setup lang="ts">
import { useAuthStore } from "@/shared/store/auth.store";
import { useRouter } from "vue-router";
import Button from "@/shared/ui/Button/ui/Button.vue";
import RefreshIcon from "@/shared/ui/RefreshIcon/ui/RefreshIcon.vue";
import { getUserInfoAsync } from "../api/getUserInfoAsync";
import CustomTreeview from "@/shared/ui/CustomTreeview/ui/CustomTreeview.vue";
import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  computed,
  nextTick,
  onBeforeUnmount,
} from "vue";
import "../style.scss";
import type { IData } from "../interface/IData";
import AvatarIcon from "@/shared/ui/AvatarIcon/ui/AvatarIcon.vue";
import type { TreeNode } from "primevue/treenode";
import { getDataAsync } from "@/shared/api/getDataAsync";
import type { IAuthorizedUser } from "../interface/IAuthorizedUser";
import { roleTables } from "@/shared/config/rolesTables";
import { localizatedSectionsList } from "@/shared/config/localizatedSections";
import { treeviewTables } from "@/shared/config/treeviewTables";
import WelcomeBanner from "@/widgets/WelcomeBanner/ui/WelcomeBanner.vue";
import GetCurrentTaskButton from "@/features/GetCurrentTaskButton/ui/GetCurrentTaskButton.vue";
import SetCurrentTaskCompleted from "@/features/SetCurrentTaskCompleted/ui/SetCurrentTaskCompleted.vue";
import ExportTableButton from "@/features/ExportTableButton/ui/ExportTableButton.vue";
import ImportTableButton from "@/features/ImportTableButton/ui/ImportTableButton.vue";
import CustomDropdown from "@/shared/ui/CustomDropdown/ui/CustomDropdown.vue";
import ExportDatabase from "@/features/ExportDatabase/ui/ExportDatabase.vue";
import ImportDatabase from "@/features/ImportDatabase/ui/ImportDatabase.vue";
import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";
import NavigationSidebar from "@/features/NavigationSidebar/ui/NavigationSidebar.vue";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import TreeviewMenu from "@/features/TreeviewMenu/ui/TreeviewMenu.vue";
import NotificationButton from "@/features/Notifications/ui/NotificationButton.vue";
import { professionEnum } from "@/shared/config/professionEnum";
import { TableData } from "@/widgets/TableData";
import { HandleEditButton } from "@/features/HandleEditButton";
import { handleSelectRow } from "../lib/handleSelectRow";
import { HandleCreateButton } from "@/features/HandleCreateButton";
import { HandleDeleteButton } from "@/features/HandleDeleteButton";
import { SidebarMenu } from "@/features/SidebarMenu";
import { TableDataPreview } from "@/features/TableDataPreview";
import { Sidebar } from "@/features/Sidebar";
import { useMenuStore } from "@/entities/MenuEntity/model/menuStore";
import AddPcbsButton from "@/features/AddPcbsButton";
import { tablesEnum } from "@/shared/config/tablesEnum";
import { handleShowDismissals } from "../model/handleShowDismissals";
import { ExitButton } from "@/shared/ui/ExitButon";
import { handleResetSection } from "../lib/handleResetSection";
import { Check } from "lucide-vue-next";
import CurrentTasksTreeview from "@/shared/ui/CustomTreeview/ui/CurrentTasksTreeview.vue";
import SystemDashboard from "@/widgets/SystemDashboard";
import OpenSettingsMenu from "@/features/OpenSettingsMenu";
import SettingsMenu from "@/widgets/SettingsMenu";
import ProfileIcon from "@/shared/ui/ProfileIcon";
import OpenProfile from "@/features/OpenProfile";
import ProfileSidebar from "@/widgets/ProfileSidebar";
import InformationSidebar from "@/widgets/InformationSidebar/ui/InformationSidebar.vue";
import  TooltipIcon from "@/shared/ui/TooltipIcon";
import { PackageMinus } from 'lucide-vue-next';

const authStore = useAuthStore();
const router = useRouter();
const authorizedUserStore = useAuthorizedUserStore();
const navigationStore = useNavigationStore();
const menuStore = useMenuStore();

/**
 * Данные, которые отображаются в таблице
 */
const data = ref<any[]>([]);
const isMenuOpen = ref<boolean>(false);
const authorizedUser = ref<IAuthorizedUser | null>(null);

const isSettingsMenuOpen = ref<boolean>(false);
const informationSidebar = ref<string | null>(null);
const isNotificationsMenuOpen = ref<boolean>(false);
const isEditProfile = ref<boolean>(false);

const localizatedSections = ref<any>([]);

const treeviewData = ref<TreeNode[]>([]);
const treeviewRef = ref(null);

const selectedRow = ref();

const currentProfession = ref<string[]>([]);

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

const isSelectOpen = ref<boolean>(false); // Добавляем реактивную переменную для отслеживания состояния select

// --- Фильтры по столбцам ---

const columnFilters = ref<Record<string, string | null>>({});
const filterDropdownOpen = ref<Record<string, boolean>>({});

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
  if (navigationStore.currentSection === "system") return;
  const config: IData = {
    endpoint: `/${navigationStore.currentSection}/generateData`,
  };
  console.debug(config);

  try {
    const response = await getDataAsync(config);

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

watch(
  () => authorizedUserStore.user,
  (val) => {
    navigationStore.currentSection = null;
    navigationStore.selectedRow = null;
    navigationStore.activeRow = null;
  }
);

async function onUpdateCallBack() {
  await getCurrentData();
  treeviewRef.value?.refreshTree?.();
}

watch(
  () => navigationStore.currentSection,
  (newVal) => {
    currentSection.value = newVal;
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

  authorizedUser.value = {
    user: user,
  };
  const professionTitle: string = user.employeeProfession?.reduce((acc: string, item: any, index: number) => {
    return index+1 === user.employeeProfession.length ? acc + item.professions?.title : acc + item.professions?.title + ", ";
  }, '').trim()

  if (user) {
    authorizedUserStore.setUser({
      id: authorizedUser.value.user?.id,
      firstName: user.employees.peoples.firstName,
      lastName: user.employees.peoples.lastName,
      middleName: user.employees.peoples.middleName,
      professionTitle: professionTitle,
      employeeData: user?.employees,
      employeeProfession: user?.employeeProfession
    });
  }

  document.addEventListener("click", handleGlobalClick);

  updateTime();
  timer = setInterval(updateTime, 1000);
  document.addEventListener("click", handleClickOutside);

  localizatedSections.value = localizatedSectionsList;

  /**
   * Массив с названиями профессий сотрудника
   */
  const professionTitles = user.employeeProfession?.map((item: any) => item.professions?.title)

  const tables = roleTables
    .filter(
      (item) => professionTitles.includes(item.profession)
    )
    .map((item) => item.tables)
    .flat();

  sectionsList.value = tables;
  sectionsList.value = sectionsList.value.map((item) => {
    return item;
  });
});

watch(() => authorizedUser.value, (newVal) => {
  newVal.user?.employeeProfession.map((item) => currentProfession.value.push(item.professions?.title.toLowerCase()))
})

watch(
  () => navigationStore.currentSection,
  async (newSection: string, oldVal: string) => {
    console.debug(newSection);
    if (!newSection) return;
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

onUnmounted(() => {
  if (timer) {
    clearInterval(timer); // Очищаем интервал при размонтировании компонента
  }
  menuStore.activeEntity = null;
  navigationStore.currentSection = null;
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

onBeforeUnmount(() => {
  document.removeEventListener("click", handleGlobalClick);
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

// обработчик кликов по документу
/**
 * Метод для сброса курсора
 * @param event
 */
const handleGlobalClick = (event: MouseEvent) => {
  const treeEl = treeviewRef.value?.$el || treeviewRef.value;
  const tableEl = document.querySelector(".data-table");
  const treeviewEl = document.querySelector(".treeview");
  const sidebarEl = document.querySelector(".sidebar");
  const headerEl = document.querySelector(".header");
  const createButton = document.getElementById("createButton");
  const editButton = document.getElementById("editButton");
  const modalInstance = document.getElementById("modalInstance");
  const deleteButton = document.getElementById("deleteButton");
  const addPcbsButton = document.getElementById("addPcbsButton");
  const addPcbsComponentButton = document.getElementById(
    "addPcbsComponentButton"
  );
  const customDropdown = document.getElementById("customDropdown");

  const clickedInsideTree = treeEl?.contains(event.target as Node);
  const clickedInsideTable = tableEl?.contains(event.target as Node);
  const clickedInsideSidebar = sidebarEl?.contains(event.target as Node);
  const clickedInsideHeader = headerEl?.contains(event.target as Node);
  const clickedInCreateButton = createButton?.contains(event.target as Node);
  const clickedInEditButton = editButton?.contains(event.target as Node);
  const clickedInsideModalInstance = modalInstance?.contains(
    event.target as Node
  );
  const clickedInsideTreeview = treeviewEl?.contains(event.target as Node);
  const clickedInsideDeleteButton = deleteButton?.contains(
    event.target as Node
  );
  const clickedInAddPcbsButton = addPcbsButton?.contains(event.target as Node);
  const clickedInAddPcbsComponentButton = addPcbsComponentButton?.contains(
    event.target as Node
  );
  const clickedInCustomDropdown = customDropdown?.contains(
    event.target as Node
  );

  if (
    !clickedInsideTree &&
    !clickedInsideTable &&
    !clickedInsideSidebar &&
    !clickedInsideHeader &&
    !clickedInCreateButton &&
    !clickedInEditButton &&
    !clickedInsideModalInstance &&
    !clickedInsideTreeview &&
    !clickedInsideDeleteButton &&
    !clickedInAddPcbsButton &&
    !clickedInAddPcbsComponentButton &&
    !clickedInCustomDropdown
  ) {
    navigationStore.selectedRow = null;
  }
};

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
    <aside class="sidebar" :class="informationSidebar && 'freeze'">
      <div @click="handleResetSection" class="logo">А ПРАКТИКУМ </div>
      
      <Sidebar />
    </aside>
      <Transition name="informationSidebar">
        <InformationSidebar v-if="informationSidebar !== null" :on-close="() => informationSidebar = null">
          <template v-if="informationSidebar === 'profile'">
            <ProfileSidebar v-if="!isEditProfile">
              <template #editButton>
                <HandleEditButton 
                  @click="() => informationSidebar = null"
                  :icon-visible="false" 
                  :is-edit-profile="true" 
                  :onSuccessCallback="onUpdateCallBack" 
                  :extra-classes="['profileSidebar__button']" 
                />
              </template>
            </ProfileSidebar>
          </template>
        </InformationSidebar>
      </Transition>
      

    <!-- Main Content Area -->
    <main :class="informationSidebar && 'freeze'" class="main-content">
      <!-- Header -->
      <div class="header">
        <div class="header__controls">
          
          <OpenSettingsMenu
            :handle-click="
              () => isSettingsMenuOpen = !isSettingsMenuOpen
            "
          />
        </div>
      </div>

      <!-- Пока что SettingsMenu отображается корректно с 3 слотами.
          Если добавить больше или убрать - верстка поедет -->
      <Transition name="settingsMenu">
        <SettingsMenu v-if="isSettingsMenuOpen">
          <template #profile>
            <OpenProfile @click="() => isSettingsMenuOpen = false" :handle-click="() => informationSidebar = 'profile'" />
          </template>
          <template #notifications>
            <NotificationButton @click="() => isSettingsMenuOpen = false" :handle-click="() => informationSidebar = 'notifications'" />
          </template>
          <template #exit>
            <ExitButton :handle-click="logout" :extra-classes="['exitButton']" />
          </template>
        </SettingsMenu>
      </Transition>

      <TableDataPreview
        v-if="menuStore.activeEntity && !navigationStore.currentSection"
      />

      <!-- Content -->
      <section
        data-js-content-section
        class="content-section"
        v-else-if="navigationStore.activeRow || navigationStore.currentSection"
      >
        <h2 class="content-section__title">
          {{
            navigationStore.currentSection === "system"
              ? "Системные настройки"
              : localizatedSections[currentSection]
          }}
        </h2>
        <!-- Action Buttons, Search, and Filter Placeholder -->
        <div class="controls">
          <!-- Кнопки для админа -->
          <div
            v-if="
              (authorizedUserStore.user?.professionTitle.toLowerCase() ===
                professionEnum.admin ||
                authorizedUserStore.user?.professionTitle.toLowerCase() ===
                  professionEnum.director) &&
              navigationStore.currentSection !== 'system'
            "
            class="action-buttons"
          >
            <HandleCreateButton
              v-if="
                navigationStore.currentSection !== `pcbs` &&
                navigationStore.currentSection !== `current_task_states_log`
              "
              :onSuccessCallback="onUpdateCallBack"
            />
            <AddPcbsButton
              v-if="
                navigationStore.currentSection === `pcbs` &&
                navigationStore.currentSection !== `current_task_states_log`
              "
              :onSuccessCallback="onUpdateCallBack"
            />
            <HandleEditButton
              :icon-visible="true"
              :is-edit-profile="false"
              :onSuccessCallback="onUpdateCallBack"
              v-if="
                navigationStore.currentSection !== `current_task_states_log`
              "
            />

            <HandleDeleteButton
              :onUpdateCallback="onUpdateCallBack"
              v-if="
                navigationStore.currentSection !== `current_task_states_log` &&
                authorizedUserStore.user?.professionTitle.toLowerCase() !==
                  professionEnum.supplier
              "
            />
            <Button :onClick="onUpdateCallBack">
              <RefreshIcon /> обновить
            </Button>
            <Button
              v-if="navigationStore.currentSection === 'employees'"
              @click="handleShowDismissals"
              >Показать уволенных</Button
            >
          </div>
          <!-- Кнопки для сотрудников -->
          <div
            v-else
            class="action-buttons"
            v-if="navigationStore.currentSection !== 'system'"
          >
            <HandleCreateButton
              v-if="
                navigationStore.currentSection === 'arrival_invoices' &&
                currentProfession.includes(professionEnum.supplier)
              "
              :onSuccessCallback="onUpdateCallBack"
            />
            <HandleEditButton
              :icon-visible="true"
              :is-edit-profile="false"
              :onSuccessCallback="onUpdateCallBack"
              v-if="
                navigationStore.currentSection === 'arrival_invoices' &&
                currentProfession.includes(professionEnum.supplier)
              "
            />
            <HandleDeleteButton
              :onUpdateCallback="onUpdateCallBack"
              v-if="
                navigationStore.currentSection === 'arrival_invoices' &&
                currentProfession.includes(professionEnum.supplier)
              "
            />
            <Button :onClick="onUpdateCallBack">
              <RefreshIcon /> обновить
            </Button>
            <template
              v-if="navigationStore.currentSection === tablesEnum.current_tasks"
            >
              <GetCurrentTaskButton :onSuccessCallback="onUpdateCallBack" />
              <SetCurrentTaskCompleted :onSuccessCallback="onUpdateCallBack" />
            </template>
          </div>
          <div
            class="search-filter"
            v-if="navigationStore.currentSection !== 'system'"
          >
            <input
              type="text"
              placeholder="Поиск"
              class="search-input"
              v-model="searchQuery"
            />
          </div>
        </div>

        <div class="table-container" v-if="showTableContainer">
          <!-- Если текущая секция находится в массиве treeviewTables - значит отображаем Treeview -->
          <template v-if="treeviewTables.includes(currentSection)">
            <CustomTreeview
              ref="treeviewRef"
              :search-query="searchQuery"
              :current-section="currentSection"
              @node-select="handleSelectRow"
            />
          </template>
          <template
            v-else-if="navigationStore.currentSection === `current_tasks`"
          >
            <CurrentTasksTreeview
              :search-query="searchQuery"
              ref="treeviewRef"
              :current-section="currentSection"
              @node-select="handleSelectRow"
            />
          </template>
          <template v-else-if="menuStore.activeEntity?.tableName === 'system'">
            <SystemDashboard :on-success-callback="onUpdateCallBack" />
          </template>
          

          <TableData
            v-else
            :headers="currentTableHeaders"
            :paginated-data="paginatedData"
            @edit-click="handleSelectRow"
          />
        </div>
        

        <!-- Pagination -->
        <div
          v-if="
            !treeviewTables.includes(currentSection) &&
            navigationStore.currentSection !== `current_tasks` &&
            navigationStore.currentSection !== `system`
          "
          class="pagination"
        >
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
