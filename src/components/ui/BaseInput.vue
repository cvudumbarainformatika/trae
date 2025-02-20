<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
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
  }
})

const emit = defineEmits(['update:modelValue'])

const inputClasses = computed(() => {
  return [
    'w-full px-4 py-2.5 text-sm transition-all duration-200 ease-in-out',
    'rounded-lg border shadow-sm outline-none',
    'focus:ring-2 focus:ring-offset-0 focus:ring-opacity-50 focus:border-primary-500 focus:ring-primary-500/20',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    'text-gray-900 dark:text-white',
    props.disabled ? 'bg-gray-100 cursor-not-allowed opacity-75 dark:bg-dark-600' : 'bg-white dark:bg-dark-700',
    props.error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
  ]
})
</script>

<template>
  <div class="space-y-1.5">
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    
    <input
      :type="type"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="inputClasses"
    >

    <p
      v-if="error"
      class="text-sm text-red-500 font-medium"
    >
      {{ error }}
    </p>
  </div>
</template>