<script setup lang="ts">
import { localizatedSectionsList } from "@/shared/config/localizatedSections";
import { useTableDataPreview } from "../model/useTableDataPreview";
import "../style.scss";

const { data, handleClick } = useTableDataPreview();
</script>
<template>
  <div class="tableDataPreview">
    <div
      v-for="item in data"
      class="tableDataPreview__button"
      @click="handleClick(item)"
    >
      {{ localizatedSectionsList[item.name] }}
    </div>
  </div>
</template>
