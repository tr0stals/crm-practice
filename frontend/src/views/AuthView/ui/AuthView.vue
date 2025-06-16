<script setup lang="ts">
import "../style.scss";
import { ref } from "vue";
import LoginForm from "@/features/LoginForm/ui/LoginForm.vue";
import RegisterForm from "@/features/RegisterForm/ui/RegisterForm.vue";

const isLogin = ref(true);
</script>

<template>
  <div class="auth-view">
    <div class="button-group">
      <button @click="isLogin = true" :class="{ active: isLogin }">Вход</button>
      <button @click="isLogin = false" :class="{ active: !isLogin }">
        Регистрация
      </button>
    </div>
    <LoginForm v-if="isLogin" />
    <RegisterForm v-else />
  </div>
</template>
