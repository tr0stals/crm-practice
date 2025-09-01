<script lang="ts" setup>
import RegisterForm from "@/features/RegisterForm/ui/RegisterForm.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import "../style.scss";

const router = useRouter();
const isLogin = ref<boolean>(false);
</script>
<template>
  <div class="superAdmin" v-if="!isLogin">
    <h1 class="superAdmin__title">Добро пожаловать в CRM-систему!</h1>
    <button
      class="superAdmin__registerButton"
      @click="router.push('/register')"
    >
      Создать пользователя
    </button>
  </div>
</template>
