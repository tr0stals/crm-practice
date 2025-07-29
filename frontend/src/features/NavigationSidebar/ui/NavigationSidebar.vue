<script setup lang="ts">
import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";
import "../style.scss";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { localizatedSectionsList } from "@/shared/config/localizatedSections";
import { useSectionSelect } from "../model/useSectionSelect";
import { useIsWarehouseVisible } from "../model/useIsWarehouseVisible";

const props = defineProps<{
  sectionsList: any;
}>();

const navigationStore = useNavigationStore();
const { handleSelect } = useSectionSelect();
// const isWarehouseVisible = useIsWarehouseVisible();
</script>
<template>
  <nav class="navigationSidebar">
    <ul class="navigationSidebar__menu">
      <li
        class="navigationSidebar__menu__item"
        v-for="section in props.sectionsList"
        :data-js-sectionName="section"
        @click="handleSelect(section)"
      >
        {{ localizatedSectionsList[section] }}
      </li>
      <!-- <template v-if="isWarehouseVisible">
        <li
          class="navigationSidebar__menu__item"
          @click="navigationStore.currentSection = 'warehouse_components'"
        >
          Склад
        </li>
      </template> -->
    </ul>
  </nav>
</template>
