<script setup lang="ts">
import "../style.scss";
import { ref } from "vue";
import { useAuthStore } from "@/shared/store/auth.store";
import { useRouter } from "vue-router";
import { loginApi } from "../api/loginApi";
import { useUserStore } from "@/shared/store/user.store";
import { useToast } from "vue-toastification";

const userName = ref("");
const password = ref("");
const authStore = useAuthStore();
const router = useRouter();
const token = ref<string | null>(localStorage.getItem("token") || null);
const error = ref<string | null>(null);
const toast = useToast();

const handleSubmit = async () => {
  try {
    await loginUser(userName.value, password.value);
    toast.success("Успешный вход!");
    router.push("/dashboard");
  } catch (error) {
    toast.error("Ошибка авторизации");
    console.error("Login failed:", error);
  }
};

const loginUser = async (userName: string, password: string) => {
  try {
    const response = await loginApi(userName, password);

    if (response.data.token) {
      token.value = response.data.token;
      localStorage.setItem("token", response.data.token);
      authStore.token = token.value;
      error.value = null;
    }
  } catch (err) {
    error.value = "Неверные учетные данные";
    throw err;
  }
};
</script>

<template>
  <div class="login-form">
    <h2 class="login-form__title">Вход</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="form-group__label" for="userName"
          >Имя пользователя:</label
        >
        <input
          class="form-group__text"
          type="text"
          id="userName"
          v-model="userName"
          required
        />
      </div>
      <div class="form-group">
        <label class="form-group__label" for="password">Пароль:</label>
        <input
          class="form-group__text"
          type="password"
          id="password"
          v-model="password"
          required
        />
      </div>
      <button type="submit" class="submit-button">Войти</button>
      <p v-if="authStore.error" class="error">Ошибка авторизации</p>
    </form>
  </div>
</template>
