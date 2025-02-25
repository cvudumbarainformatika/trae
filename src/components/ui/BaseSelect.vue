<script setup>
import { computed, ref, watch, onMounted } from 'vue'

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
  },
  clearable: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits(['update:modelValue'])

const searchQuery = ref('')
const isOpen = ref(false)
const selectedIndex = ref(-1)

// Initialize searchQuery with the selected option's label
const initializeSearchQuery = () => {
  if (props.modelValue) {
    const selectedOption = props.options.find(option => {
      const value = typeof option === 'object' ? option[props.optionValue] : option
      return value === props.modelValue
    })
    if (selectedOption) {
      searchQuery.value = typeof selectedOption === 'object' ? selectedOption[props.optionLabel] : selectedOption
    }
  }
}

// Watch for changes in modelValue and options
watch(() => props.modelValue, initializeSearchQuery)
watch(() => props.options, initializeSearchQuery)

// Initialize on component mount
onMounted(initializeSearchQuery)

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
  if (!event.target.value) {
    emit('update:modelValue', '')
  }
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
const handleClear = () => {
  emit('update:modelValue', '')
  searchQuery.value = ''
  isOpen.value = false
  selectedIndex.value = -1
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
      
      <div v-if="clearable && modelValue" class="absolute inset-y-0 right-0 flex items-center pr-2">
        <button
          type="button"
          @click="handleClear"
          class="p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <svg
            class="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <button
          v-if="clearable && modelValue"
          type="button"
          @click="handleClear"
          class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </button>

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