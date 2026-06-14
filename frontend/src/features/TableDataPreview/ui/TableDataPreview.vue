<script setup lang="ts">
import { localizatedSectionsList } from "@/shared/config/localizatedSections";
import { useTableDataPreview } from "../model/useTableDataPreview";
import "../style.scss";
import { useMenuEntity } from "../model/useMenuEntity";

const { data, handleClick } = useMenuEntity();
</script>
<template>
  <Transition name="fadeIn">
    <div class="tableDataPreview">
      <div
        v-for="item in data"
        class="tableDataPreview__button"
        @click="handleClick(item)"
      >
        {{ localizatedSectionsList[item.name] }}
        {{ item.title }}
      </div>
    </div>
  </Transition>
</template>
