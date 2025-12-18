<script setup lang="ts">
import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";
import "../style.scss";

const authorizedUserStore = useAuthorizedUserStore();
</script>

<template>
  <section class="welcome-container">
    <div class="welcome-card">
      <img
        src="/src/views/Dashboard/img/ukqawu62wctf9v072xi2c6yypvsjghcp.png"
        alt="Логотип"
        class="welcome-logo"
        loading="lazy"
      />
      <h1 class="welcome-message-part1">
        Добро пожаловать,
        {{
          authorizedUserStore.user?.firstName +
          " " +
          authorizedUserStore.user?.lastName
        }}!
      </h1>
    </div>
  </section>
</template>
