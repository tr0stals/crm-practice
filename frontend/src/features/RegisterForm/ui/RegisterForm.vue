<script setup lang="ts">
import "../style.scss";
import { ref } from "vue";
import { useAuthStore } from "@/shared/store/auth.store";
import { useRouter } from "vue-router";
import type { IUserRegister } from "../interface/IUserRegister";
import { register } from "../api/registerApi";
import { useToast } from "vue-toastification";
import { loginApi } from "../api/loginApi";

const userName = ref("");
const password = ref("");
const authStore = useAuthStore();
const router = useRouter();
const error = ref<string | null>(null);
const toast = useToast();
const token = ref<string | null>(localStorage.getItem("token") || null);

const handleSubmit = async () => {
  try {
    const user: IUserRegister = {
      userName: userName.value,
      password: password.value,
      passwordSalt: password.value,
      email: "",
      firstName: "",
      lastName: "",
      middleName: "",
      phone: "",
      birthDate: null,
      comment: "",
    };
    const response = await registerUser(user);
    console.debug(response);
    toast.success("Успешная регистрация!");
    await loginUser(user.userName, user.password);
    router.push("/dashboard");
  } catch (error) {
    toast.error("Ошибка регистрации");
    console.error("Registration failed:", error);
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

const registerUser = async (user: any) => {
  try {
    await register(user);
    error.value = null;
  } catch (err: any) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else {
      error.value = "Ошибка регистрации";
    }
    throw err;
  }
};
</script>

<template>
  <div class="register-form">
    <h2 class="register-form__title">Создание нового пользователя</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="form-group__label" for="userName">Логин</label>
        <input
          class="form-group__text"
          type="text"
          id="userName"
          v-model="userName"
          required
        />
      </div>
      <div class="form-group">
        <label class="form-group__label" for="password">Пароль</label>
        <input
          class="form-group__text"
          type="password"
          id="password"
          v-model="password"
          required
        />
      </div>
      <button type="submit" class="submit-button">Зарегистрироваться</button>
      <p v-if="authStore.error" class="error">Ошибка регистрации</p>
    </form>
  </div>
</template>
