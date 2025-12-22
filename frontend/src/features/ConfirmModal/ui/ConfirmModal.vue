<script lang="ts" setup>
import "../style.scss";
import Button from "@/shared/ui/Button/ui/Button.vue";
import LoadingLayout from "@/shared/ui/LoadingLayout/ui/LoadingLayout.vue";
import { getConfirmText } from "@/shared/utils/textTemplates";

interface Props {
  onSuccessCallback: () => void;
  onDeclineCallback: () => void;
  section?: string;
  action?: string;
  customText?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  action: "delete",
  section: "default",
});

const confirmText =
  props.customText || getConfirmText(props.section, props.action as any);
</script>

<template>
  <div class="confirmModal modalWindow">
    <LoadingLayout v-if="loading" />
    <template v-else>
      <h1 class="confirmModal__title">{{ confirmText }}</h1>
      <div class="confirmModal__controls">
        <Button
          :extra-classes="['confirmModal__button']"
          @click="props.onSuccessCallback"
        >
          Да
        </Button>
        <Button
          :extra-classes="['confirmModal__button']"
          @click="props.onDeclineCallback"
        >
          Нет
        </Button>
      </div>
    </template>
  </div>
</template>
