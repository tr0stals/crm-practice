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

const authStore = useAuthStore();
const router = useRouter();

const data = ref<any[]>([]);
const isMenuOpen = ref(false);

/**
 * Наполняем этот массив по ходу
 */
const sectionsList = ["License", "Users", "Stands"];
/**
 * Текущая секция
 */
const currentSection = ref("License");

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const logout = () => {
  authStore.logout();
  router.push("/login");
};

/*
 *  Эта функция должна срабатывать при клике на кнопку "Редактировать"
 *  или при двойном клике на ячейку в таблице.
 */
const handleEditModalWindow = () => {
  const cfg: IEdittingProps = {
    // Здесь нужно будет указывать объект с данными из таблицы.
    // Например, users - указываем объект: {id: 1, userName: Pavel, password: 123, email: example@mail.ru...}
    ...licenseData,
  };
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
  updateTime(); // Обновляем время сразу при монтировании
  timer = setInterval(updateTime, 1000); // Обновляем время каждую секунду
});

watch(currentSection, async (newSection) => {
  const config: IData = {
    endpoint: `${newSection.toLowerCase()}/get`,
  };
  console.debug(config.endpoint);

  const response = await getDataAsync(config);
  data.value = response.data;
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
            <Button text="Удалить" :image="DeleteIcon" />
            <Button text="Обновить" :image="RefreshIcon" />
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
                <th v-for="(value, key) in data[0]" :key="key">
                  {{ key }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in data" :key="item.id || index">
                <td v-for="(value, key) in item" :key="key">
                  <template v-if="typeof value === 'boolean'">
                    <input type="checkbox" :checked="value" disabled />
                  </template>
                  <template v-else>
                    {{ value }}
                  </template>
                </td>
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
