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
import {
  ref,
  onMounted,
  onUnmounted,
  reactive,
  watch,
  type Ref,
  computed,
} from "vue";
import "../style.scss";
import { getDataAsync } from "../api/getDataAsync";
import type { IData } from "../interface/IData";
import { DashboardModel } from "../model/DashboardModel";
import { getUsers } from "@/shared/api/userApi";
import { deleteDataAsync } from "../api/deleteDataAsync";
import AddModalWindow from "@/features/AddModalWindow/ui/AddModalWindow.vue";
import AvatarIcon from "@/shared/ui/AvatarIcon/ui/AvatarIcon.vue";
import AddEntity from "@/features/AddEntity/ui/AddEntityModal.vue";

// TODO: сделать рефакторинг. Перенести бизнес-логику в DashboardModel.ts

const authStore = useAuthStore();
const router = useRouter();

/**
 * Данные, которые отображаются в таблице
 */
const data = ref<any[]>([]);
const isMenuOpen = ref(false);
const userFirstName = ref("[First name]");
const userLastName = ref("[Last name]");

const selectedRow = ref<any | null>(null);

/**
 * Наполняем этот массив по ходу
 */
const sectionsList = ref([]);
/**
 * Текущая секция
 */
const currentSection = ref("");
const targetData = ref();

// Поисковый запрос для фильтрации
const searchQuery = ref("");

// Переменные для пагинации
const currentPage = ref(1);
const itemsPerPage = ref(3); // Для теста ставим 3 строки на странице

// Добавляем вычисляемое свойство для фильтрации данных
const filteredData = computed(() => {
  if (!searchQuery.value) return data.value;

  const query = searchQuery.value.toLowerCase();
  return data.value.filter((item) => {
    return Object.values(item).some((value) => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(query);
    });
  });
});

// Вычисляемое свойство для данных текущей страницы
const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredData.value.slice(startIndex, endIndex);
});

// Вычисляемое свойство для общего количества страниц
const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage.value);
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const getSectionList = async () => {
  const cfg: IData = {
    endpoint: "database/names",
  };

  return await getDataAsync(cfg).then((res) => (sectionsList.value = res.data));
};

const logout = () => {
  authStore.logout();
  router.push("/login");
};

const getCurrentData = async () => {
  const config: IData = {
    endpoint: `${currentSection.value.toLowerCase()}/get`,
  };

  try {
    const response = await getDataAsync(config);
    data.value = response.data;
  } catch (e) {
    console.error(e);
  }
};

const onUpdateCallBack = async () => {
  getCurrentData();
};

/**
 *  Эта функция должна срабатывать при клике на кнопку "Редактировать"
 *  или при двойном клике на ячейку в таблице.
 */
const handleEditModalWindow = () => {
  const cfg: IEdittingProps = {
    sectionName: currentSection.value,
    data: targetData.value,
  };

  if (!cfg.data) {
    alert("Выберите строку для редактирования");
    return;
  }

  ModalManager.getInstance().open(EditModalWindow, {
    config: cfg,
    onApplyCallback: onUpdateCallBack,
  });
};

const currentTime = ref("");
const avatarImage = ref(""); // Переменная для изображения аватара, изначально пустая
const currentDate = ref(""); // Переменная для текущей даты
let today = ""; // Переменная для хранения текущего дня, чтобы обновлять дату только раз в день

const updateTime = () => {
  const now = new Date();
  currentTime.value = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);

  // Обновляем дату только если день изменился
  const newToday = new Intl.DateTimeFormat("ru-RU").format(now);
  if (newToday !== today) {
    today = newToday;
    currentDate.value = today;
  }
};

let timer: ReturnType<typeof setInterval> | undefined;

onMounted(async () => {
  new DashboardModel();
  getSectionList();

  updateTime(); // Обновляем время и дату сразу при монтировании
  timer = setInterval(updateTime, 1000); // Обновляем время каждую секунду
});

/**
 * Здесь мы следим за состоянием переменной currentSection,
 * для того, чтобы менять контент таблицы (Users, License, Stands, ...)
 */
watch(currentSection, async (newSection: string) => {
  selectedRow.value = null;
  targetData.value = null;

  getCurrentData(newSection);
});

watch(selectedRow, (newVal) => {
  console.debug(newVal);
  targetData.value = newVal;
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer); // Очищаем интервал при размонтировании компонента
  }
});

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

const getUserInfo = async () => {
  const token = localStorage.getItem("token");

  const cfg = {
    endpoint: "auth/check",
    data: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };

  const response = getDataAsync(cfg);
  response.then((res) => console.debug(res.data.user));
};

getUserInfo();

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

// TODO: сделать добавление
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
    onClose: ModalManager.getInstance().closeModal,
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
</script>

<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">А ПРАКТИКУМ</div>
      <nav class="menu">
        <ul>
          <li
            @click="currentSection = section"
            :data-js-sectionName="section"
            v-for="section in sectionsList"
          >
            {{ section }}
          </li>
        </ul>
      </nav>
      <nav class="menu">
        <ul>
          <li>
            <div @click="toggleMenu" class="menu-item-with-dropdown">
              [HEADER TEXT]
              <span class="dropdown-icon" :class="{ rotated: isMenuOpen }"
                >▼</span
              >
            </div>
            <ul v-if="isMenuOpen" class="dropdown-menu">
              <li>Пункт меню 1</li>
              <li>Пункт меню 2</li>
              <li>Пункт меню 3</li>
            </ul>
          </li>
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
            <div class="user-name">{{ userFirstName }}</div>
            <div class="user-details">{{ userLastName }}</div>
            <div class="user-details">{{ currentTime }}</div>
            <div class="user-details">{{ currentDate }}</div>
          </div>
        </div>
        <button class="logout-button" @click="logout">Выйти</button>
      </header>

      <!-- Content -->
      <section class="content-section">
        <h2 class="content-section__title">{{ currentSection }}</h2>

        <!-- Action Buttons, Search, and Filter Placeholder -->
        <div class="controls">
          <div class="action-buttons">
            <Button
              @click="handleCreateModalWindow"
              text="Добавить"
              :image="PlusIcon"
              :extraClasses="['action-button-style']"
            />
            <Button
              @click="handleEditModalWindow"
              text="Редактировать"
              :image="EditIcon"
              :extraClasses="['action-button-style']"
            />
            <Button
              text="Удалить"
              :image="DeleteIcon"
              @click="handleDeleteRow"
              :extraClasses="['action-button-style']"
            />
            <Button
              text="Обновить"
              :image="RefreshIcon"
              @click="refreshUsers"
              :extraClasses="['action-button-style']"
            />
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
        <div class="table-container" v-if="paginatedData.length">
          <table class="data-table">
            <thead>
              <tr>
                <template v-for="(value, key) in paginatedData[0]">
                  <th :key="key" v-if="key !== 'password'">
                    {{ key }}
                  </th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in paginatedData"
                :data-js-section-data="JSON.stringify(item)"
                :key="item.id || index"
                @click="selectedRow = item"
                @dblclick="handleEditModalWindow"
                :class="{ 'selected-row': selectedRow?.id === item.id }"
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
          <button @click="prevPage" :disabled="currentPage === 1">&lt;</button>
          <button @click="firstPage" :disabled="currentPage === 1">
            &lt;&lt;
          </button>
          <template v-for="page in totalPages" :key="page">
            <button
              @click="gotoPage(page)"
              :class="{ active: currentPage === page }"
            >
              {{ page }}
            </button>
          </template>
          <button @click="lastPage" :disabled="currentPage === totalPages">
            &gt;&gt;
          </button>
          <button @click="nextPage" :disabled="currentPage === totalPages">
            &gt;
          </button>
        </div>
      </section>
    </main>
  </div>
</template>
