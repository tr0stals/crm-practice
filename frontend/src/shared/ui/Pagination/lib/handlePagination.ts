import { ref, computed } from "vue";

export default function handlePagination(dataForPaginate: any) {
  let page = ref(1);

  console.debug(dataForPaginate);
  const data = Array.from(dataForPaginate.keys()).map((item) => {
    return { index: item, value: `${item}` };
  });
  console.debug("!!!!!!", data);

  const perPage = 10;

  const paginatedData = computed(() =>
    data.slice((page.value - 1) * perPage, page.value * perPage)
  );

  const nextPage = () => {
    if (page.value !== Math.ceil(data.length / perPage)) {
      page.value += 1;
    }
  };

  const backPage = () => {
    if (page.value !== 1) {
      page.value -= 1;
    }
  };

  const goToPage = (numPage: any) => {
    page.value = numPage;
  };

  return { data, paginatedData, perPage, page, nextPage, backPage, goToPage };
}
