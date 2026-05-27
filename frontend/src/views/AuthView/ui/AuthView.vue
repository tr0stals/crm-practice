<script setup lang="ts">
import "../style.scss";
import { ref } from "vue";
import LoginForm from "@/features/LoginForm/ui/LoginForm.vue";
import RegisterForm from "@/features/RegisterForm/ui/RegisterForm.vue";

const isRegistred = ref<boolean>(true);
</script>

<template>
  <div class="auth-view">
    <LoginForm v-if="isRegistred" />
    <RegisterForm v-else />

    <button @click="isRegistred = !isRegistred">Зарегистрироваться</button>
  </div>
</template>
