<script setup lang="ts">
import { ref } from "vue";
import "../style.scss";

const props = defineProps<{ 
    tooltipText: string; 
    tooltipPosition?: string 
}>();

const isTooltipVisible = ref(false);
</script>

<template>
  <div class="tooltipIcon" @mouseenter="isTooltipVisible = true" @mouseleave="isTooltipVisible = false" :class="tooltipPosition ? tooltipPosition : 'tooltip--bottom'">
    <Transition name="tooltip">
        <span 
        v-if="isTooltipVisible" 
        class="tooltipIcon__text" 
       >
        {{ props.tooltipText }}
      </span>
    </Transition>

    <slot name="icon" class="tooltipIcon__icon" />
  </div>
</template>
