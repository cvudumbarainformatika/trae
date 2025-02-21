<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  optionValue: {
    type: String,
    default: 'value'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select an option'
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

const searchQuery = ref('')
const isOpen = ref(false)
const selectedIndex = ref(-1)

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  return props.options.filter(option => {
    const label = typeof option === 'object' ? option[props.optionLabel] : option
    return label.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const selectClasses = computed(() => {
  return [
    'w-full px-4 py-2.5 text-sm transition-all duration-200 ease-in-out',
    'rounded-lg border shadow-sm outline-none appearance-none',
    'focus:ring-2 focus:ring-offset-0 focus:ring-opacity-50 focus:border-primary-500 focus:ring-primary-500/20',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    'text-gray-900 dark:text-white',
    props.disabled ? 'bg-gray-100 cursor-not-allowed opacity-75 dark:bg-dark-600' : 'bg-white dark:bg-dark-700',
    props.error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
  ]
})

const handleInput = (event) => {
  searchQuery.value = event.target.value
  isOpen.value = true
}

const handleSelect = (option) => {
  const value = typeof option === 'object' ? option[props.optionValue] : option
  emit('update:modelValue', value)
  searchQuery.value = typeof option === 'object' ? option[props.optionLabel] : option
  isOpen.value = false
}

const handleKeydown = (event) => {
  if (!isOpen.value) {
    if (event.key === 'ArrowDown' || event.key === 'Enter') {
      isOpen.value = true
      event.preventDefault()
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      selectedIndex.value = (selectedIndex.value + 1) % filteredOptions.value.length
      event.preventDefault()
      break
    case 'ArrowUp':
      selectedIndex.value = selectedIndex.value <= 0 ? filteredOptions.value.length - 1 : selectedIndex.value - 1
      event.preventDefault()
      break
    case 'Enter':
      if (selectedIndex.value > -1) {
        handleSelect(filteredOptions.value[selectedIndex.value])
        event.preventDefault()
      }
      break
    case 'Escape':
      isOpen.value = false
      event.preventDefault()
      break
  }
}

const handleBlur = () => {
  setTimeout(() => {
    isOpen.value = false
    selectedIndex.value = -1
  }, 200)
}
const handleFocus = () => {
  isOpen.value = true
}
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
    
    <div class="relative">
      <input
        type="text"
        :value="searchQuery"
        @input="handleInput"
        @keydown="handleKeydown"
        @focus="handleFocus"
        @blur="handleBlur"
        :disabled="disabled"
        :required="required"
        :placeholder="placeholder"
        :class="selectClasses"
      />
      
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg
          class="h-4 w-4 text-gray-400 dark:text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>

      <div
        v-if="isOpen && filteredOptions.length > 0"
        class="absolute z-50 w-full mt-1 bg-white dark:bg-dark-700 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg max-h-60 overflow-auto"
      >
        <div
          v-for="(option, index) in filteredOptions"
          :key="typeof option === 'object' ? option[optionValue] : option"
          @mousedown="handleSelect(option)"
          :class="[
            'px-4 py-2 cursor-pointer text-sm',
            'hover:bg-gray-100 dark:hover:bg-dark-600',
            selectedIndex === index ? 'bg-gray-100 dark:bg-dark-600' : '',
            'text-gray-900 dark:text-white'
          ]"
        >
          {{ typeof option === 'object' ? option[optionLabel] : option }}
        </div>
      </div>
    </div>

    <p
      v-if="error"
      class="text-sm text-red-500 font-medium"
    >
      {{ error }}
    </p>
  </div>
</template>