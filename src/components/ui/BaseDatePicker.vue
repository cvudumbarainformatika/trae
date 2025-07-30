<script setup>
import { computed } from 'vue'
// import BaseInput from './BaseInput.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select date'
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  min: {
    type: String,
    default: ''
  },
  max: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const today = new Date().toISOString().split('T')[0]
</script>

<template>
  <BaseInput v-model="inputValue" :label="label" :placeholder="placeholder" :error="error" :required="required"
    :disabled="disabled" type="date" :min="min || '1900-01-01'" :max="max || '2100-12-31'">
    <!-- <template #prefix>
      <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        aria-hidden="true">
        <path fill-rule="evenodd"
          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
          clip-rule="evenodd" />
      </svg>
    </template> -->
  </BaseInput>
</template>

<style scoped>
:deep(input[type="date"]) {
  @apply pl-10;
}

:deep(input[type="date"]::-webkit-calendar-picker-indicator) {
  @apply absolute left-0 w-full h-full opacity-0 cursor-pointer;
}
</style>
