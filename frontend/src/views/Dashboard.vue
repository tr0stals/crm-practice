<script setup lang="ts">
import { useAuthStore } from "@/shared/store/auth.store";
import { useRouter } from "vue-router";
import Button from "@/shared/ui/Button/ui/Button.vue";
import PlusIcon from "@/shared/ui/PlusIcon/ui/PlusIcon.vue";
import EditIcon from "@/shared/ui/EditIcon/ui/EditIcon.vue";
import DeleteIcon from "@/shared/ui/DeleteIcon/ui/DeleteIcon.vue";
import RefreshIcon from "@/shared/ui/RefreshIcon/ui/RefreshIcon.vue";

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<!-- 
  Временная страница. Вместо нее перебрасывать пользователя на главную станицу
-->
<template>
  <div>
    <h1>Добро пожаловать в Dashboard!</h1>
    <p>Вы успешно вошли в систему.</p>
    <button @click="logout">Выйти</button>
  </div>

  <!-- Пример использования -->
  <div style="display: flex; flex-direction: row">
    <Button text="Добавить" :image="PlusIcon" buttonColor="button__buttonAdd" />
    <Button text="Редактировать" :image="EditIcon" />
    <Button text="удалить" :image="DeleteIcon" />
    <Button text="обновить" :image="RefreshIcon" />
  </div>
</template>
