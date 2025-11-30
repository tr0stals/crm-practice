<script setup lang="ts">
import "../style.scss";
</script>

<template>
  <div class="settingsMenu">
    <slot name="profile" />
    <slot name="notifications" />
    <slot name="exit" />
    <slot name="asd" />
  </div>
</template>
