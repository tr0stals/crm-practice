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
import { licenseData } from "@/shared/config/mockData";
import { ref, onMounted, onUnmounted, reactive, watch } from "vue";
import "../style.scss";
import { getDataAsync } from "../api/licenseApi";
import type { IData } from "../interface/IData";
import { DashboardModel } from "../model/DashboardModel";
import { deleteUser, getUsers } from '@/shared/api/userApi'

// TODO: сделать рефакторинг. Перенести бизнес-логику в DashboardModel.ts

const authStore = useAuthStore();
const router = useRouter();

/**
 * Данные, которые отображаются в таблице
 */
const data = ref<any[]>([]);
const isMenuOpen = ref(false);

const selectedRow = ref<any | null>(null);

/**
 * Наполняем этот массив по ходу
 */
const sectionsList = ["License", "Users", "Stands"];
/**
 * Текущая секция
 */
const currentSection = ref("License");
const targetData = ref();

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const logout = () => {
  authStore.logout();
  router.push("/login");
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

  ModalManager.getInstance().open(EditModalWindow, { config: cfg });
};

const currentTime = ref("");
const avatarImage = ref(""); // Переменная для изображения аватара, изначально пустая

const updateTime = () => {
  const now = new Date();
  currentTime.value = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);
};

let timer: ReturnType<typeof setInterval> | undefined;

onMounted(async () => {
  new DashboardModel();

  updateTime(); // Обновляем время сразу при монтировании
  timer = setInterval(updateTime, 1000); // Обновляем время каждую секунду
});

/**
 * Здесь мы следим за состоянием переменной currentSection,
 * для того, чтобы менять контент таблицы (Users, License, Stands, ...)
 */
watch(currentSection, async (newSection) => {
  selectedRow.value = null;
  targetData.value = null;

  const config: IData = {
    endpoint: `${newSection.toLowerCase()}/get`,
  };

  try {
    const response = await getDataAsync(config);
    data.value = response.data;
  } catch (e) {
    console.error(e);
  }
});

watch(selectedRow, (newVal) => {
  console.debug(newVal);
  targetData.value = newVal;
});

onUnmounted(() => {
  clearInterval(timer); // Очищаем таймер при размонтировании компонента
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
  if (currentSection.value === 'Users') {
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
const handleDeleteUser = async () => {
  if (currentSection.value !== 'Users') return;
  if (!selectedRow.value || !selectedRow.value.id) {
    alert('Выберите пользователя для удаления');
    return;
  }
  try {
    await deleteUser(selectedRow.value.id);
    await refreshUsers();
  } catch (e) {
    alert('Ошибка при удалении пользователя');
    console.error(e);
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
          <img :src="avatarImage" alt="User Avatar" class="avatar" />
          <div>
            <div class="user-name">[First name]</div>
            <div class="user-details">[Last name]</div>
            <div class="user-details">{{ currentTime }}</div>
          </div>
        </div>
        <button class="logout-button" @click="logout">Выйти</button>
      </header>

      <!-- Content -->
      <section class="content-section">
        <h2>{{ currentSection }}</h2>

        <!-- Action Buttons, Search, and Filter Placeholder -->
        <div class="controls">
          <div class="action-buttons">
            <Button
              text="Добавить"
              :image="PlusIcon"
              buttonColor="button__buttonAdd"
            />
            <Button
              @click="handleEditModalWindow"
              text="Редактировать"
              :image="EditIcon"
              :extraClasses="['button__buttonBlue']"
            />
            <Button text="Удалить" :image="DeleteIcon" @click="handleDeleteUser" />
            <Button text="Обновить" :image="RefreshIcon" @click="refreshUsers" />
          </div>
          <div class="search-filter">
            <input type="text" placeholder="Поиск" class="search-input" />
          </div>
        </div>

        <!-- Table -->
        <div class="table-container" v-if="data.length">
          <table class="data-table">
            <thead>
              <tr>
                <template v-for="(value, key) in data[0]">
                  <th :key="key" v-if="key !== 'password'">
                    {{ key }}
                  </th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in data"
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
          <button>&lt;</button>
          <button>&lt;&lt;</button>
          <button class="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>&gt;&gt;</button>
          <button>&gt;</button>
        </div>
      </section>
    </main>
  </div>
</template>
