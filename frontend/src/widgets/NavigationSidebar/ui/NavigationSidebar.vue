<script setup lang="ts">
import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";
import "../style.scss";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { localizatedSectionsList } from "@/shared/config/localizatedSections";
import { useSectionSelect } from "../model/useSectionSelect";
import { useIsWarehouseVisible } from "../model/useIsWarehouseVisible";

const props = defineProps<{
  sectionsList: string[];
}>();

const navigationStore = useNavigationStore();
const { handleSelect } = useSectionSelect();
const isWarehouseVisible = useIsWarehouseVisible();
</script>
<template>
  <nav class="menu">
    <ul>
      <li
        v-for="section in props.sectionsList"
        :data-js-sectionName="section"
        @click="handleSelect(section)"
      >
        {{ localizatedSectionsList[section] }}
      </li>
      <template v-if="isWarehouseVisible">
        <li @click="navigationStore.currentSection = 'warehouse_components'">
          Склад
        </li>
      </template>
    </ul>
  </nav>
</template>
