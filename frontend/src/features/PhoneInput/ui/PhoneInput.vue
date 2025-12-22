<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import IMask from 'imask'

const props = defineProps<{
  modelValue: string | null
  id?: string
  name?: string
  placeholder?: string
  class?: string
}>()

const emit = defineEmits(['update:modelValue'])

const inputRef = ref<HTMLInputElement | null>(null)
let mask: any = null

onMounted(() => {
  if (!inputRef.value) return

  mask = IMask(inputRef.value, {
    mask: '+{7}(000)000-00-00',
  })

  mask.on('accept', () => {
    emit('update:modelValue', mask.value)
  })

  if (props.modelValue ?? null) {
    mask.value = props.modelValue ?? ''
  }
})

onBeforeUnmount(() => {
  if (mask) mask.destroy()
})

watch(
  () => props.modelValue,
  (v) => {
    if (!mask) return
    if (v == null) mask.value = ''
    else if (mask.value !== v) mask.value = v
  }
)
</script>

<template>
  <input
    ref="inputRef"
    :id="id"
    :name="name"
    :placeholder="placeholder || '+7 (___) ___-__-__'"
    :class="class"
    :value="modelValue ?? ''"
  />
</template>
