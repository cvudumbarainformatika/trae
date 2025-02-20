<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  padding: {
    type: String,
    default: 'p-6'
  },
  noPadding: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'bordered'].includes(value)
  },
  class: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div
    :class="[
      'bg-white dark:bg-gray-900 rounded-lg shadow-md',
      !noPadding && padding,
      variant === 'bordered' && 'border border-secondary-200 dark:border-secondary-700'
    ]"
  >
    <div v-if="title || subtitle" :class="['mb-4', noPadding && 'px-6 pt-6']">
      <h3 v-if="title" class="text-lg font-medium text-secondary-900 dark:text-white">{{ title }}</h3>
      <p v-if="subtitle" class="mt-1 text-sm text-secondary-500 dark:text-secondary-400">{{ subtitle }}</p>
    </div>
    
    <div :class="[noPadding && 'px-6']">
      <slot></slot>
    </div>

    <div v-if="$slots.footer" :class="[noPadding && 'px-6 pb-6']">
      <slot name="footer"></slot>
    </div>
  </div>
</template>