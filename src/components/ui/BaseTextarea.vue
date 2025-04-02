<template>
  <div class="relative">
    <textarea
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :class="[
        'w-full px-4 py-2.5 text-sm transition-all duration-200 ease-in-out',
        'rounded-lg border shadow-sm outline-none',
        'focus:ring-2 focus:ring-offset-0 focus:ring-opacity-50 focus:border-primary-500 focus:ring-primary-500/20',
        'placeholder:text-gray-400 dark:placeholder:text-gray-500',
        'text-gray-900 dark:text-white',
        disabled ? 'bg-gray-100 cursor-not-allowed opacity-75 dark:bg-dark-600' : 'bg-white dark:bg-dark-700',
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      ]"
    />
    <div v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-500">{{ error }}</div>
  </div>
</template>

<script setup>

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  rows: {
    type: Number,
    default: 3
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>