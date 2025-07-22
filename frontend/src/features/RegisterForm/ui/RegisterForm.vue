<script setup lang="ts">
import "../style.scss";
import { ref } from "vue";
import { useAuthStore } from "@/shared/store/auth.store";
import { useRouter } from "vue-router";
import type { IUserRegister } from "../interface/IUserRegister";
import { register } from "../api/registerApi";
import { useToast } from "vue-toastification";

const userEmail = ref("");
const password = ref("");
const confirmPassword = ref("");
const userName = ref("");
const firstName = ref("");
const lastName = ref("");
const middleName = ref("");
const authStore = useAuthStore();
const router = useRouter();
const error = ref<string | null>(null);
const phone = ref("");
const birthday = ref<any>(null);
const toast = useToast();

const handleSubmit = async () => {
  try {
    const user: IUserRegister = {
      email: userEmail.value,
      firstName: firstName.value,
      lastName: lastName.value,
      password: password.value,
      middleName: middleName.value,
      userName: userName.value,
      phone: phone.value,
      passwordSalt: confirmPassword.value,
      birthDate: birthday.value,
      comment: "",
    };
    await registerUser(user);
    toast.success("Успешная регистрация!");
    router.push("/dashboard");
  } catch (error) {
    toast.error("Ошибка регистрации");
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

<template>
  <div class="register-form">
    <h2 class="register-form__title">Регистрация</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="form-group__label" for="email">Электронная почта</label>
        <input
          class="form-group__text"
          type="text"
          id="email"
          v-model="userEmail"
          required
        />
      </div>
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
      <div class="form-group">
        <label class="form-group__label" for="firstName">Имя</label>
        <input
          class="form-group__text"
          type="text"
          id="firstName"
          v-model="firstName"
          required
        />
      </div>
      <div class="form-group">
        <label class="form-group__label" for="lastName">Фамилия</label>
        <input
          class="form-group__text"
          type="text"
          id="lastName"
          v-model="lastName"
          required
        />
      </div>
      <div class="form-group">
        <label class="form-group__label" for="birthday">День рождения</label>
        <input
          class="form-group__text"
          type="date"
          name="birthday"
          id="birthday"
          v-model="birthday"
        />
      </div>
      <div class="form-group">
        <label class="form-group__label" for="middleName">Отчество</label>
        <input
          class="form-group__text"
          type="text"
          id="middleName"
          v-model="middleName"
        />
      </div>
      <div class="form-group">
        <label class="form-group__label" for="phone">Телефон</label>
        <input
          class="form-group__text"
          type="phone"
          id="phone"
          v-model="phone"
          required
        />
      </div>
      <button type="submit" class="submit-button">Зарегистрироваться</button>
      <p v-if="authStore.error" class="error">Ошибка регистрации</p>
    </form>
  </div>
</template>
