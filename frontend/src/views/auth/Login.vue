<template>
  <div class="login-container">
    <h1>Вход в CRM</h1>
    <form @submit.prevent="handleSubmit">
      <AppInput
        v-model="email"
        type="email"
        placeholder="Email"
        required
      />
      <AppInput
        v-model="password"
        type="password"
        placeholder="Пароль"
        required
      />
      <AppButton type="submit">Войти</AppButton>
      <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

const handleSubmit = async () => {
  try {
    await authStore.loginUser(email.value, password.value)
    router.push('/dashboard')
  } catch (error) {
    console.error('Ошибка входа:', error)
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>