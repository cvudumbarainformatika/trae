<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  value: {
    type: [String, Number, Boolean],
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: () => `radio-${Math.random().toString(36).substring(2, 9)}`
  }
})

const emit = defineEmits(['update:modelValue'])

const isChecked = computed(() => props.modelValue === props.value)

const handleChange = () => {
  if (!props.disabled) {
    emit('update:modelValue', props.value)
  }
}

const radioClasses = computed(() => {
  return [
    'h-4 w-4 transition-all duration-200 ease-in-out',
    'text-primary-600 focus:ring-primary-500 focus:ring-offset-0',
    props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    'border-gray-300 dark:border-gray-600'
  ]
})

const labelClasses = computed(() => {
  return [
    'ml-2 block text-sm',
    props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    'text-gray-700 dark:text-gray-300'
  ]
})
</script>

<template>
  <div class="flex items-center">
    <input
      type="radio"
      :id="id"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      :required="required"
      @change="handleChange"
      :class="radioClasses"
    />
    <label v-if="label" :for="id" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <slot></slot>
  </div>
</template>