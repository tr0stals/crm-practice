<template>
  <div class="register-form">
    <h2 class="register-form__title">Register Form</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="text" id="email" v-model="userEmail" required />
      </div>
      <div class="form-group">
        <label for="userName">Логин</label>
        <input type="text" id="userName" v-model="userName" required />
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="form-group">
        <label for="firstName">Имя</label>
        <input type="text" id="firstName" v-model="firstName" required />
      </div>
      <div class="form-group">
        <label for="lastName">Фамилия</label>
        <input type="text" id="lastName" v-model="lastName" required />
      </div>
      <div class="form-group">
        <label for="state">Статус</label>
        <input type="text" id="state" v-model="state" required />
      </div>
      <button type="submit" class="submit-button">Register</button>
      <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import "../style.scss";
import { ref } from "vue";
import { useAuthStore } from "@/shared/store/auth.store";
import { useRouter } from "vue-router";
import type { IUserRegister } from "../interface/IUserRegister";
import { register } from "../api/registerApi";
import { ModalManager } from "@/shared/plugins/modalManager";

const userEmail = ref("");
const password = ref("");
const confirmPassword = ref("");
const userName = ref("");
const firstName = ref("");
const lastName = ref("");
const state = ref("");
const authStore = useAuthStore();
const router = useRouter();
const error = ref<string | null>(null);

const handleSubmit = async () => {
  try {
    const user: IUserRegister = {
      email: userEmail.value,
      firstName: firstName.value,
      lastName: lastName.value,
      password: password.value,
      state: state.value,
      userName: userName.value,
      passwordSalt: confirmPassword.value,
    };
    await registerUser(user);
    router.push("/dashboard");
  } catch (error) {
    // Ошибка уже будет выведена через authStore.error
    console.error("Registration failed:", error);
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
