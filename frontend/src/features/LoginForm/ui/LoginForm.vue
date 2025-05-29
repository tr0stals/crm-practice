<template>
  <div class="login-form">
    <h2 class="login-form__title">Login Form</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" class="submit-button">Войти</button>
      <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import "../style.scss";
import { ref } from "vue";
import { useAuthStore } from "@/shared/store/auth.store";
import { useRouter } from "vue-router";
import { loginApi } from "../api/loginApi";

const email = ref("");
const password = ref("");
const authStore = useAuthStore();
const router = useRouter();
const token = ref<string | null>(localStorage.getItem("token") || null);
const error = ref<string | null>(null);

const handleSubmit = async () => {
  try {
    await loginUser(email.value, password.value);

    // переход после успешного входа
    router.push("/dashboard");
  } catch (error) {
    // Ошибка уже будет выведена через authStore.error
    console.error("Login failed:", error);
  }
};

const loginUser = async (email: string, password: string) => {
  try {
    const response = await loginApi(email, password);
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
