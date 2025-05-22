<template>
  <div class="register-form">
    <h2>Register Form</h2>
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
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";
import type { IUserRegister } from "@/interfaces/IUserRegister";

const userEmail = ref("");
const password = ref("");
const confirmPassword = ref("");
const userName = ref("");
const firstName = ref("");
const lastName = ref("");
const state = ref("");
const authStore = useAuthStore();
const router = useRouter();

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
    await authStore.registerUser(user);
    router.push("/dashboard");
  } catch (error) {
    // Ошибка уже будет выведена через authStore.error
    console.error("Registration failed:", error);
  }
};
</script>

<style scoped>
.register-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
