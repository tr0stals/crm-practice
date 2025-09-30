<script setup lang="ts">
import useFetch from "@/shared/lib/useFetch";
import "../style.scss";
import { defaultEndpoint } from "@/shared/api/axiosInstance";
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { localizatedSectionsList } from "@/shared/config/localizatedSections";

const { data, refetch } = useFetch(`${defaultEndpoint}/database/treeTables`);
console.debug(data);
const navigationStore = useNavigationStore();

const handleClick = (item) => {
  navigationStore.currentSection = null;
  navigationStore.activeRow = item;
};
</script>
<template>
  <div class="sidebarMenu">
    <ul class="sidebarMenu__list">
      <li
        v-for="item of data"
        class="sidebarMenu__item"
        @click="handleClick(item)"
      >
        {{ localizatedSectionsList[item.name] }}
      </li>
    </ul>
  </div>
</template>
