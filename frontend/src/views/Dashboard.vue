<template>
  <div>
    <h1>Добро пожаловать в Dashboard!</h1>
    <p>Вы успешно вошли в систему.</p>
    <button @click="logout">Выйти</button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
