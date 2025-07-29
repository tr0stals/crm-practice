<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { useGetRelatedTables } from "../model/useGetRelatedTables";
import "../style.scss";

const props = defineProps<{
  sectionName: any;
}>();

const navigationStore = useNavigationStore();
const currentSection = ref<string>("");
const {} = useGetRelatedTables(props.sectionName);

const sectionTables = ref<{
  data: string[] | null;
  loading: boolean;
} | null>(null);
</script>

<template>
  <template v-if="sectionTables?.loading">
    <div class="spinner-border spinner" role="status"></div>
  </template>

  <nav v-else class="navigationSidebar">
    <ul class="navigationSidebar__menu">
      <li
        v-for="section in sectionTables?.data"
        :key="section"
        class="navigationSidebar__menu__item"
        :data-js-sectionName="section"
      >
        {{ section }}
      </li>
    </ul>
  </nav>
</template>
