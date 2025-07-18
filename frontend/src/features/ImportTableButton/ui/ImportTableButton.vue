<script setup lang="ts">
import { ref } from "vue";
import { importTable } from "../api/importTable";
import Button from "@/shared/ui/Button/ui/Button.vue";
import { useGlobalStore } from "@/shared/store/globalStore";

const selectedFile = ref<File | null>(null);
const loading = ref(false);
const globalStore = useGlobalStore();

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    selectedFile.value = files[0];
  }
};

const handleImport = async () => {
  if (!selectedFile.value) return;

  loading.value = true;

  try {
    const result = await importTable(
      globalStore.currentSection,
      selectedFile.value
    );
    console.log("Импорт завершён:", result);
    alert(
      `Импорт завершён: добавлено ${result.imported}, ошибок: ${result.failed}`
    );
  } catch (e) {
    alert("Ошибка при импорте таблицы");
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div class="flex flex-col gap-2">
    <input type="file" accept=".csv,.xlsx" @change="handleFileChange" />
    <Button :disabled="!selectedFile || loading" @click="handleImport">
      {{ loading ? "Импорт..." : "Импортировать таблицу" }}
    </Button>
  </div>
</template>
