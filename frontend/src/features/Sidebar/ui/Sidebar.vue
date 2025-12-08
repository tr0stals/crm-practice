<script lang="ts" setup>
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import "../style.scss";
import { useMenuStore } from "@/entities/MenuEntity/model/menuStore";
import { menuEntities } from "../config/menuEntities";
import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";
import { computed } from "vue";

const menuStore = useMenuStore();
const navigationStore = useNavigationStore();
const authorizedUserStore = useAuthorizedUserStore();

const handleClick = (item: any) => {
  navigationStore.currentSection = null;
  menuStore.activeEntity = item;
  navigationStore.setActiveRow(item);
};

const filterMenuByProfessions = (menu: any[], professions: string[]): any[] => {
  return menu
    .map((item) => {
      const filteredChildren = item.children
        ? filterMenuByProfessions(item.children, professions)
        : [];

      const hasChildren = filteredChildren.length > 0;

      // Проверяем пересечение профессий
      const isAllowed = item.professions
        ? item.professions.some((p: string) => professions.includes(p))
        : false;

      if (isAllowed || hasChildren) {
        return { ...item, children: filteredChildren };
      }

      return null;
    })
    .filter(item => item !== null);
};

const filteredMenu = computed(() => {
  const professions = authorizedUserStore.user?.employeeProfession?.map(
    (ep: any) => ep.professions?.title
  ) ?? [];

  return filterMenuByProfessions(menuEntities, professions);
});
</script>

<template>
  <div class="sidebarMenu">
    <ul class="sidebarMenu__list">
      <li
        v-for="item in filteredMenu"
        :key="item.title"
        @click="handleClick(item)"
        class="sidebarMenu__item"
      >
        <img class="itemIcon" v-if="item.icon" :src="item.icon" alt="" />
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>
