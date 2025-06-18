<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'ghost'].includes(value)
  },
  iconPosition: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value)
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
  label: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
})

const variantClasses = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white',
  secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white',
  success: 'bg-success-600 hover:bg-success-700 text-white',
  danger: 'bg-danger-600 hover:bg-danger-700 text-white',
  warning: 'bg-warning-600 hover:bg-warning-700 text-white',
  info: 'bg-cyan-600 hover:bg-cyan-700 text-white',
  ghost: 'bg-transparent hover:bg-gray-700/50 dark:text-white text-gray-500'
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}
</script>

<template>
  <button :type="type" :disabled="disabled || loading" :class="[
    'rounded-lg font-medium transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    block ? 'w-full' : 'inline-flex items-center justify-center',
    'focus:ring-' + variant + '-500'
  ]">

    <!-- Spinner -->
    <svg v-if="loading" class="animate-spin h-5 w-5 text-white absolute"
      :class="iconPosition === 'right' ? 'right-3' : 'left-3'" xmlns="http://www.w3.org/2000/svg" fill="none"
      viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>


    <slot name="icon-left" v-if="$slots['icon-left'] && iconPosition === 'left' && !loading" class="mr-2"></slot>
    <span v-if="label">{{ label }}</span>
    <slot v-else></slot>
    <slot name="icon-right" v-if="$slots['icon-right'] && iconPosition === 'right' && !loading" class="ml-2"></slot>
  </button>
</template>
