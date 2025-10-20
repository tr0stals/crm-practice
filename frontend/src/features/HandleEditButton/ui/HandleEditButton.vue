<script setup lang="ts">
import EditIcon from "@/shared/ui/EditIcon/ui/EditIcon.vue";
import Button from "@/shared/ui/Button/ui/Button.vue";
import "../style.scss";
import { useHandleEdit } from "../model/useHandleEdit";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { tablesEnum } from "@/shared/config/tablesEnum";
import { ref, watch } from "vue";

const navigationStore = useNavigationStore();

const disabled = ref<boolean>(false);

watch(
  () => navigationStore.selectedRow?.data?.nodeType,
  (val) => {
    if (val === tablesEnum.organization_types) disabled.value = true;
    else disabled.value = false;
  }
);

const props = defineProps<{
  onSuccessCallback: () => void;
}>();
</script>
<template>
  <Button
    :disabled="disabled"
    :extra-classes="disabled ? [`button--disabled`] : []"
    @click="useHandleEdit(props.onSuccessCallback)"
  >
    <EditIcon /> редактировать
  </Button>
</template>
