<template>
  <button
    class="app-button"
    :type="type"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset'
}>()

defineEmits(['click'])
</script>

<style scoped>
.app-button {
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.app-button:hover {
  background: #33a06f;
}
</style>