<script setup lang="ts">
import EditIcon from "@/shared/ui/EditIcon/ui/EditIcon.vue";
import Button from "@/shared/ui/Button/ui/Button.vue";
import "../style.scss";
import { useHandleEdit } from "../model/useHandleEdit";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { tablesEnum } from "@/shared/config/tablesEnum";
import { ref, watch } from "vue";
import { useEditProfile } from "../model/useEditProfile";

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

/**
 * @Param isEditProfile - определяем, редактируем профиль или запись
 */
const props = defineProps<{
  isEditProfile: boolean;
  onSuccessCallback: () => void;
  iconVisible: boolean;
  extraClasses?: string[]
}>();
</script>
<template>
  <Button
    id="editButton"
    :disabled="disabled"
    :extra-classes="[
      disabled ? 'button--disabled' : '',
      ...(extraClasses ?? [])
    ]"
    @click="props.isEditProfile ? useEditProfile() : useHandleEdit(props.onSuccessCallback)"
  >
    <EditIcon v-if="props.iconVisible" /> редактировать
  </Button>
</template>
