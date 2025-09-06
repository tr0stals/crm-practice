<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { computed, onMounted } from "vue";

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
    v-model="value"
    :id="id"
    :name="name"
    :disabled="props.config?.disabled"
    :format="props.config?.format || 'yyyy-MM-dd'"
    :hide-input-icon="props.config?.hideInputIcon"
    model-type="yyyy-MM-dd"
    auto-apply
  />
</template>
