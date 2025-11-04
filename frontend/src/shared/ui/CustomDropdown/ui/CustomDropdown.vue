<script setup lang="ts">
import type { ICustomDropdown } from "../interface/ICustomDropdown";
import Button from "../../Button/ui/Button.vue";
import "../style.scss";
import { getGeneratedAttrs } from "@/shared/utils/getGeneratedAttrs";
import PlusIcon from "@/shared/ui/PlusIcon/ui/PlusIcon.vue";

const props = defineProps<{
  dropdownTitle: string;
  dropdownItems: ICustomDropdown[];
}>();

const additionalKeys = ["добавить", "создать"];
</script>

<template>
  <div class="dropdown customDropdown" id="customDropdown">
    <Button
      data-bs-toggle="dropdown"
      aria-expanded="false"
      class="dropdown-toggle button"
    >
      <template v-if="additionalKeys.includes(props.dropdownTitle)">
        <PlusIcon />
      </template>

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
          v-bind="getGeneratedAttrs(item.extraAttrs)"
        >
          {{ item.text }}
        </li>
      </template>
    </ul>
  </div>
</template>
