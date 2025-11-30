<script setup lang="ts">
import "../style.scss";
import Button from "@/shared/ui/Button/ui/Button.vue";
import ProfileIcon from "@/shared/ui/ProfileIcon";
import { SettingsIcon } from "lucide-vue-next";

const props = defineProps<{
  handleClick: () => void;
}>();
</script>
<template>
  <div class="openSettingsMenu">
    <Button
      :extra-classes="[
        'openSettingsMenu--withoutBackground',
        'openSettingsMenu__button',
      ]"
      :handle-click="props.handleClick"
    >
      <SettingsIcon />
    </Button>
  </div>
</template>
