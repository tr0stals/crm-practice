<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { computed, onMounted } from "vue";
import "../style.scss";

const props = defineProps<{
  modelValue: Date | string | null;
  id: any;
  name: any;
  extraClasses?: string[];
  config?: {
    disabled?: boolean;
    hideInputIcon?: boolean;
    format?: string;
  };
}>();

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const emit = defineEmits<{
  (e: "update:modelValue", value: Date | string | null): void;
}>();
</script>
<template>
  <VueDatePicker
    class="datePicker"
    v-model="value"
    :id="id"
    :name="name"
    :disabled="props.config?.disabled"
    :format="props.config?.format || 'yyyy-MM-dd'"
    :hide-input-icon="props.config?.hideInputIcon"
    model-type="yyyy-MM-dd"
    auto-apply
    :clearable="true"
  >
    <template #clear-icon="{clear}" ">
      <svg
        @click="clear"
        class="datePicker__closeIcon"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19
                 12 13.41 17.59 19 19 17.59 13.41 12z"
        />
      </svg>
    </template>
  </VueDatePicker>
</template>
