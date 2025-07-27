<script setup lang="ts">
import "../style.scss";
import { ref } from "vue";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { useGlobalStore } from "@/shared/store/globalStore";
import useImportTable from "../model/useImportTable";

const globalStore = useGlobalStore();

const { selectedFile, loading, importTable } = useImportTable(globalStore);
const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileSelect = () => {
  fileInput.value?.click();
};

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    selectedFile.value = files[0];
    await importTable();
  }
};
</script>

<template>
  <input
    ref="fileInput"
    type="file"
    class="importTableButton__input"
    id="inputGroupFile04"
    aria-describedby="inputGroupFileAddon04"
    aria-label="Upload"
    @change="handleFileChange"
  />
  <Button
    class="importTableButton__button"
    type="button"
    id="inputGroupFileAddon04"
    @click="triggerFileSelect"
  >
    Импортировать таблицу
  </Button>
</template>
