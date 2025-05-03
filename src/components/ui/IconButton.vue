<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'ghost', 'indigo'].includes(value)
  },
  mode: {
    type: String,
    default: 'ghost',
    validator: (value) => ['solid', 'ghost'].includes(value)
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
  },
  tooltipPosition: {
    type: String,
    default: 'right',
    validator: (value) => ['top', 'right', 'bottom', 'left'].includes(value)
  }
})

const variantClasses = {
  primary: {
    ghost: 'text-primary-500 hover:text-primary-600',
    solid: 'bg-primary-600 hover:bg-primary-700 text-white'
  },
  secondary: {
    ghost: 'text-secondary-500 hover:text-secondary-600',
    solid: 'bg-secondary-600 hover:bg-secondary-700 text-white'
  },
  success: {
    ghost: 'text-success-500 hover:text-success-600',
    solid: 'bg-success-600 hover:bg-success-700 text-white'
  },
  danger: {
    ghost: 'text-danger-500 hover:text-danger-600',
    solid: 'bg-danger-600 hover:bg-danger-700 text-white'
  },
  warning: {
    ghost: 'text-warning-500 hover:text-warning-600',
    solid: 'bg-warning-600 hover:bg-warning-700 text-white'
  },
  info: {
    ghost: 'text-cyan-500 hover:text-cyan-600',
    solid: 'bg-cyan-600 hover:bg-cyan-700 text-white'
  },
  ghost: {
    ghost: 'text-gray-400 hover:text-gray-300',
    solid: 'bg-gray-600 hover:bg-gray-700 text-white'
  },
  indigo: {
    ghost: 'text-indigo-500 hover:text-indigo-600',
    solid: 'bg-indigo-600 hover:bg-indigo-700 text-white'
  }
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
      class="flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      :class="[
        variantClasses[variant][mode],
        sizeClasses[size],
        block ? 'w-full' : '',
        mode === 'ghost' ? 'hover:bg-gray-700/50' : ''
      ]"
    >
      <slot name="icon" />
    </button>
    <div
      v-if="tooltip"
      class="absolute z-[99999] px-3 py-1.5 text-sm text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap backdrop-blur-sm bg-gray-800/90 border border-gray-700/50 shadow-xl"
      :class="{
        'left-full ml-2 top-1/2 -translate-y-1/2': tooltipPosition === 'right',
        'right-full mr-2 top-1/2 -translate-y-1/2': tooltipPosition === 'left',
        'bottom-full mb-2 left-1/2 -translate-x-1/2': tooltipPosition === 'top',
        'top-full mt-2 left-1/2 -translate-x-1/2': tooltipPosition === 'bottom'
      }"
    >
      {{ tooltip }}
    </div>
  </div>
</template>
