<script setup lang="ts">
import type { ICustomDropdown } from "../interface/ICustomDropdown";
import Button from "../../Button/ui/Button.vue";
import "../style.scss";

const props = defineProps<{
  dropdownTitle: string;
  dropdownItems: ICustomDropdown[];
}>();
</script>

<template>
  <div class="dropdown customDropdown">
    <Button
      data-bs-toggle="dropdown"
      aria-expanded="false"
      class="dropdown-toggle button"
    >
      {{ props.dropdownTitle }}
    </Button>
    <ul class="dropdown-menu customDropdown__menu">
      <template v-for="(item, index) in props.dropdownItems" :key="index">
        <!-- Если в дропдауне нужно отображать компонент -->
        <li v-if="item.component" class="customDropdown__menu__item">
          <component :is="item.component" />
        </li>

        <!-- Если просто текст -->
        <li
          v-else
          class="customDropdown__menu__item"
          @click="item.onClickCallback?.(item.value)"
        >
          {{ item.text }}
        </li>
      </template>
    </ul>
  </div>
</template>
