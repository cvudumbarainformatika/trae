<script setup>
import { computed } from 'vue'
// import BaseRadio from './BaseRadio.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  name: {
    type: String,
    default: () => `radio-group-${Math.random().toString(36).substring(2, 9)}`
  },
  label: {
    type: String,
    default: ''
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  optionValue: {
    type: String,
    default: 'value'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  inline: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (value) => {
  emit('update:modelValue', value)
}

const groupClasses = computed(() => {
  return [
    props.inline ? 'flex flex-wrap gap-4' : 'space-y-2'
  ]
})
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <div :class="groupClasses">
      <BaseRadio v-for="option in options" :key="typeof option === 'object' ? option[optionValue] : option"
        :id="`${name}-${typeof option === 'object' ? option[optionValue] : option}`" :name="name"
        :model-value="modelValue" :value="typeof option === 'object' ? option[optionValue] : option"
        :label="typeof option === 'object' ? option[optionLabel] : option" :disabled="disabled" :required="required"
        @update:model-value="handleChange" />
    </div>

    <p v-if="error" class="text-sm text-red-500 font-medium mt-1">
      {{ error }}
    </p>
  </div>
</template>
