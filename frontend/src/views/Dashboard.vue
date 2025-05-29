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
import { ref, onMounted, onUnmounted } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

const isMenuOpen = ref(false);

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

const currentTime = ref('');
const avatarImage = ref(''); // Переменная для изображения аватара, изначально пустая

const updateTime = () => {
  const now = new Date();
  currentTime.value = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now);
  console.log('Current time updated:', currentTime.value);
};

let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  updateTime(); // Обновляем время сразу при монтировании
  timer = setInterval(updateTime, 1000); // Обновляем время каждую секунду
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
          <li>[HEADER TEXT]</li>
          <li>[SECTION NAME]</li>
          <li>[SECTION NAME]</li>
          <li>[SECTION NAME]</li>
          <li>[SECTION NAME]</li>
          <li>[SECTION NAME]</li>
          <li>
            <div @click="toggleMenu" class="menu-item-with-dropdown">
              [HEADER TEXT]
              <span class="dropdown-icon" :class="{ rotated: isMenuOpen }">▼</span>
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
        <h2>[SECTION NAME]</h2>

        <!-- Action Buttons, Search, and Filter Placeholder -->
        <div class="controls">
          <div class="action-buttons">
            <Button text="Добавить" :image="PlusIcon" buttonColor="button__buttonAdd" />
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
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>[NAME]</th>
                <th>[NAME]</th>
                <th>[NAME]</th>
                <th>20.01.2025</th>
                <th>05.09.2025</th>
                <th>[NAME]</th>
                <th>[NAME]</th>
                <th>[NAME]</th>
                <th>[NAME]</th>
                <th>[NAME]</th>
              </tr>
            </thead>
            <tbody>
              <!-- Example row -->
              <tr>
                <td>Данные 1</td>
                <td>Данные 2</td>
                <td>Данные 3</td>
                <td>Дата А</td>
                <td>Дата Б</td>
                <td>Данные 6</td>
                <td>Данные 7</td>
                <td>Данные 8</td>
                <td>Данные 9</td>
                <td><input type="checkbox" checked /></td>
              </tr>
               <!-- Placeholder rows -->
              <tr v-for="n in 15" :key="n">
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td><input type="checkbox" /></td>
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

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  font-family: sans-serif;
  background-color: #f8f8f8; /* Фон страницы, светлее основного контента */
}

.sidebar {
  width: 250px;
  background-color: #f0f0f0; /* Цвет сайдбара по изображению */
  padding: 20px;
  box-sizing: border-box;
  border-right: 1px solid #e0e0e0; /* Разделитель между сайдбаром и контентом */
}

.logo {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px; /* Увеличил отступ после логотипа */
  color: #0056b3; /* Примерный синий цвет по изображению */
  text-align: center; /* Центрировал логотип */
}

.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  margin-bottom: 5px;
  padding: 0; /* Убираем padding у li */
  cursor: pointer;
  border-radius: 4px;
  color: #333;
  font-size: 1.9em;
}

.menu li:hover {
  background-color: transparent; /* Убираем фон при наведении на родительский li */
}

.menu li .dropdown-icon {
    float: right;
    font-size: 0.8em;
    color: #666;
    transition: transform 0.3s ease; /* Добавляем плавный переход */
}

.menu li .dropdown-icon.rotated {
    transform: rotate(180deg); /* Поворачиваем на 180 градусов */
}

.menu-item-with-dropdown {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 10px; /* Оставляем padding здесь для кликаемой области */
  margin: 0; /* Убираем отрицательный margin */
}

.dropdown-menu {
    list-style: none;
    padding: 0 0 0 20px; /* Отступы слева для вложенных пунктов */
    margin-top: 5px; /* Уменьшил отступ сверху */
    background-color: transparent; /* Прозрачный фон */
    border: none; /* Убираем рамку */
    border-radius: 0; /* Убираем скругление */
    box-shadow: none; /* Убираем тень */
    position: static; /* Убеждаемся, что позиционирование статическое */
    width: 100%;
    box-sizing: border-box;
    z-index: auto; /* Сбрасываем z-index */
}

.dropdown-menu li {
    padding: 8px 15px; /* Отступы внутри пунктов меню */
    cursor: pointer;
    font-size: 0.8em; /* Уменьшил размер шрифта еще немного */
    color: #555; /* Чуть более темный цвет для вложенных пунктов */
}

.dropdown-menu li:hover {
    background-color: #e9e9e9; /* Подсветка при наведении */
}

.main-content {
  flex-grow: 1;
  padding: 20px 30px 20px 30px; /* Используем padding вместо margin для отступов внутри */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: #fff; /* Белый фон основной области */
  margin: 20px; /* Оставляем margin по бокам и сверху */
  border-radius: 8px; /* Скругление углов основной области */
  box-shadow: 0 2px 5px rgba(0,0,0,0.1); /* Легкая тень */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px; /* Увеличил отступ после шапки */
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px; /* Отступ между аватаром и текстом */
}

.avatar {
  width: 45px; /* Немного увеличил размер аватара */
  height: 45px;
  object-fit: cover; /* Обрезка изображения, чтобы оно вписывалось в круг */
  border-radius: 50%;
  flex-shrink: 0; /* Аватар не сжимается */
  cursor: pointer; /* Курсор-указатель при наведении */
}

.user-name {
  font-weight: bold;
  font-size: 2em;
  color: #333;
}

.user-details {
  font-size: 1.6em;
  color: #666;
}

.logout-button {
  background-color: #f4f4f4;
  color: #555;
  border: 1px solid #ddd;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.5em;
}

.logout-button:hover {
  background-color: #e0e0e0; /* Темнее при наведении */
}

.user-info > div { /* Стили для div, содержащего имя, фамилию и время */
    display: flex;
    flex-direction: column;
    justify-content: center; /* Центрирование текста по вертикали */
}

.user-info > div > div:nth-child(3) {
  font-size: 2em; /* Устанавливаем размер как у .user-name */
  color: #666; /* Оставляем цвет текста как у .user-details */
}

.content-section {
    flex-grow: 1; /* Позволяет секции занимать всё доступное вертикальное пространство */
    display: flex; /* Делаем секцию flex-контейнером */
    flex-direction: column; /* Элементы внутри выстраиваем по вертикали */
    overflow: hidden; /* Скрываем содержимое, выходящее за пределы контейнера */
}

.content-section h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #333; /* Цвет заголовка секции */
}

.controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap; /* Перенос элементов на новую строку при уменьшении ширины */
    gap: 15px; /* Отступ между группами элементов управления */
    flex-shrink: 0; /* Элементы управления не сжимаются */
}

.action-buttons {
    display: flex;
    gap: 10px;
}

/* Устанавливаю серый фон и синий текст для всех кнопок действий */
.action-buttons .button {
    background-color: #f4f4f4;
    color: #0056b3; /* Синий цвет из логотипа */
    border: 1px solid #ddd; /* Оставляем серую рамку */
}

.search-filter {
    display: flex;
    align-items: center;
}

.filter-icon {
    /* Эти стили больше не используются */
}

.search-input {
    padding: 8px 12px; /* Оставляем внутренние отступы */
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1.3em;
}

.search-icon {
     /* Эти стили больше не используются */
}

.data-table {
  width: 100%; /* Устанавливаем ширину таблицы в 100% контейнера */
  min-width: 1000px; /* Минимальная ширина таблицы, чтобы показать горизонтальный скролл при необходимости */
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.table-container {
    overflow-x: auto; /* Добавляем горизонтальный скролл */
    flex-grow: 1; /* Позволяет контейнеру таблицы занимать оставшееся пространство */
    margin-bottom: 0; /* Убираем нижний отступ, чтобы не конфликтовал с пагинацией */
    overflow-y: auto; /* Добавляем вертикальный скролл при необходимости */
}

.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 10px 8px;
  text-align: left;
  font-size: 1.9em; /* Увеличил с 1.3em до 1.9em */
}

.data-table th {
  background-color: #f2f2f2; /* Светло-серый фон заголовков */
  font-weight: bold;
  color: #333;
}

.data-table tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* Чередование строк */
}

.data-table tbody tr:hover {
    background-color: #e9e9e9; /* Подсветка строки при наведении */
}

.data-table td input[type="checkbox"] {
    margin: 0; /* Убираем стандартные отступы */
    display: block; /* Чтобы можно было центрировать, если нужно */
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 20px; /* Добавляем отступ сверху, чтобы отделить от таблицы */
  padding-top: 15px;
  border-top: 1px solid #eee;
  flex-shrink: 0; /* Пагинация не сжимается */
}

.pagination button {
  padding: 8px 12px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.3em;
  color: #555;
}

.pagination button.active {
  background-color: #007bff; /* Синий фон для активной кнопки */
  color: white;
  border-color: #007bff;
}

.pagination button:hover:not(.active) {
  background-color: #e9e9e9;
  border-color: #bbb;
}

.avatar-container {
  position: relative; /* Для позиционирования input */
  display: inline-block; /* Чтобы контейнер занимал только нужное место */
}

#avatar-upload {
  position: absolute; /* Позиционируем абсолютно */
  left: -9999px; /* Перемещаем за пределы экрана */
  /* Или альтернативный метод для полного скрытия, но сохранения кликабельности: */
  /* position: absolute; */
  /* left: -9999px; */
}
</style>
