<template>
  <div class="auth-view">
    <h1>Вход в CRM</h1>
    <div class="button-group">
      <button @click="isLogin = true" :class="{ active: isLogin }">Вход</button>
      <button @click="isLogin = false" :class="{ active: !isLogin }">Регистрация</button>
    </div>
    <LoginForm v-if="isLogin" />
    <RegisterForm v-else />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoginForm from '@/components/auth/LoginForm.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';

const isLogin = ref(true);
</script>

<style scoped>
.auth-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.button-group {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.button-group button {
  padding: 12px 32px;
  font-size: 18px;
  font-weight: bold;
  margin: 0 5px;
  border: none;
  border-radius: 8px;
  background-color: #e0e0e0;
  color: #333;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}

.button-group button.active {
  background-color: #4CAF50;
  color: white;
  box-shadow: 0 4px 16px rgba(76,175,80,0.15);
}

.button-group button:hover {
  background-color: #45a049;
  color: white;
}
</style> 