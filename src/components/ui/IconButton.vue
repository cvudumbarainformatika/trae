<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  },
  block: {
    type: Boolean,
    default: false
  },
  tooltip: {
    type: String,
    default: ''
  }
})

const variantClasses = {
  primary: 'text-primary-500 hover:text-primary-600',
  secondary: 'text-secondary-500 hover:text-secondary-600',
  success: 'text-success-500 hover:text-success-600',
  danger: 'text-danger-500 hover:text-danger-600',
  warning: 'text-warning-500 hover:text-warning-600',
  info: 'text-cyan-500 hover:text-cyan-600',
  ghost: 'text-gray-400 hover:text-gray-300'
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12'
}
</script>

<template>
  <div class="relative inline-block group">
    <button
      :type="type"
      :disabled="disabled"
      class="flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-700/50 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      :class="[
        variantClasses[variant],
        sizeClasses[size],
        block ? 'w-full' : ''
      ]"
    >
      <slot name="icon" />
    </button>
    <div
      v-if="tooltip"
      class="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg"
    >
      {{ tooltip }}
    </div>
  </div>
</template>