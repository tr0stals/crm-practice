import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<null | { firstName: string; lastName: string; email: string }>(null)

  function setUser(userData: { firstName: string; lastName: string; email: string }) {
    user.value = userData
  }

  function clearUser() {
    user.value = null
  }

  return { user, setUser, clearUser }
})
