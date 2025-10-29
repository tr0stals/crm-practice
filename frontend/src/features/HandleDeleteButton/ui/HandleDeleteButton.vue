<script setup lang="ts">
import Button from "@/shared/ui/Button/ui/Button.vue";
import "../style.scss";
import DeleteIcon from "@/shared/ui/DeleteIcon/ui/DeleteIcon.vue";
import { useHandleDelete } from "../model/useHandleDelete";
import { ref, watch } from "vue";
import { tablesEnum } from "@/shared/config/tablesEnum";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";

const props = defineProps<{
  onUpdateCallback: () => void;
}>();

const navigationStore = useNavigationStore();

const disabled = ref<boolean>(false);

watch(
  () => navigationStore.selectedRow?.data?.nodeType,
  (val) => {
    if (
      val === tablesEnum.organization_types ||
      val === tablesEnum.current_tasks
    )
      disabled.value = true;
    else disabled.value = false;
  }
);
</script>
<template>
  <Button
    :disabled="disabled"
    :extra-classes="disabled ? [`button--disabled`] : []"
    @click="useHandleDelete(props.onUpdateCallback)"
  >
    <DeleteIcon /> удалить
  </Button>
</template>
