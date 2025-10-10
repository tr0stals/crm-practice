<script lang="ts" setup>
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { menuEntities } from "../config/menuEntities";
import "../style.scss";
import { useMenuStore } from "@/entities/MenuEntity/model/menuStore";

const menuStore = useMenuStore();
const navigationStore = useNavigationStore();

const handleClick = (item: any) => {
  navigationStore.currentSection = null;
  menuStore.activeEntity = item;
  navigationStore.setActiveRow(item);
};
</script>
<template>
  <div class="sidebarMenu">
    <ul class="sidebarMenu__list">
      <li
        v-for="item of menuEntities"
        @click="handleClick(item)"
        class="sidebarMenu__item"
      >
        <img class="itemIcon" v-if="item.icon" :src="item.icon" alt="" />
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>
