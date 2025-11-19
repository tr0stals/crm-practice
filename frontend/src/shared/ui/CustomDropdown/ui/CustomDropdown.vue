<script setup lang="ts">
import type { ICustomDropdown } from "../interface/ICustomDropdown";
import Button from "../../Button/ui/Button.vue";
import "../style.scss";
import { getGeneratedAttrs } from "@/shared/utils/getGeneratedAttrs";
import PlusIcon from "@/shared/ui/PlusIcon/ui/PlusIcon.vue";

const props = defineProps<{
  dropdownTitle?: string;
  dropdownItems: ICustomDropdown[];
  extraClasses?: string[];
}>();

const additionalKeys = ["добавить", "создать"];
</script>

<template>
  <div class="dropdown customDropdown"  data-bs-auto-close="outside" id="customDropdown">
    <Button
      data-bs-toggle="dropdown"
      aria-expanded="false"
      class="dropdown-toggle"
    >
      <template v-if="typeof props.dropdownTitle === 'string'">
        {{ props.dropdownTitle }}
      </template>
      <slot v-else name="title">
        {{ props.dropdownTitle }}
      </slot>
    </Button>
    <ul class="dropdown-menu customDropdown__menu" :class="props.extraClasses?.map((item) => item)">
      <template v-for="(item, index) in props.dropdownItems" :key="index">
        <!-- Если в дропдауне нужно отображать компонент -->
        <li v-if="item.component" class="customDropdown__menu__item">
          <component :is="item.component" />
        </li>

        <!-- Если просто текст -->
        <li
          v-else
          class="customDropdown__menu__item"
          :class="{ active: item.active }"
          @click.stop="item.onClickCallback?.(item.value)"
          v-bind="getGeneratedAttrs(item.extraAttrs)"
        >
          {{ item.text }}
        </li>
      </template>
    </ul>
  </div>
</template>
