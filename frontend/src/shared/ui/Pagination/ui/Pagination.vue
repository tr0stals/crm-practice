<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  paginatedData: any;
}>();
console.debug(props.paginatedData);

const page = ref(1);
const perPage = 10;

const nextPage = () => {
  if (page.value < Math.ceil(props.paginatedData.length / perPage)) {
    page.value++;
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
  }
};
</script>

<template>
  <div class="pagination">
    <button @click="prevPage" :disabled="page === 1">← Назад</button>
    <span
      >Страница {{ page }} из
      {{ Math.ceil(props.paginatedData.length / perPage) }}</span
    >
    <button
      @click="nextPage"
      :disabled="page === Math.ceil(props.paginatedData.length / perPage)"
    >
      Вперёд →
    </button>
  </div>
</template>
