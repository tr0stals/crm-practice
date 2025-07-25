import { computed, ref } from "vue";

export default function handlePagination(data: any) {
  const page = ref(1);
  const perPage = 5;

  const dataForPaginate = computed(() => {
    const start = (page.value - 1) * perPage;
    return data.slice(start, start + perPage);
  });

  return {
    dataForPaginate,
  };
}
