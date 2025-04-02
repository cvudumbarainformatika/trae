<script setup>
import { computed, ref } from 'vue'

const inputRef = ref(null)

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
  hint: {
    type: String,
    default: ''
  },
  showRupiahHint: {
    type: Boolean,
    default: false
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
  debounce: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'clear'])

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

let debounceTimeout

const handleInput = (e) => {
  const value = e.target.value
  
  if (props.debounce > 0) {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      emit('update:modelValue', value)
    }, props.debounce)
  } else {
    emit('update:modelValue', value)
  }
}

const formattedRupiah = computed(() => {
  if (!props.modelValue) return 'Rp 0'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(props.modelValue)
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
    
    <div class="relative">
      <input
        ref="inputRef"
        :type="type"
        :value="modelValue"
        @input="handleInput"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[inputClasses, clearable && 'pr-10']"
      >
      
      <div v-if="clearable && modelValue" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <button
          type="button"
          @click="()=> {
            emit('update:modelValue', '')
            emit('clear')
          }"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <p
      v-if="error"
      class="text-sm text-red-500 font-medium"
    >
      {{ error }}
    </p>
    
    <p
      v-else-if="showRupiahHint && modelValue"
      class="text-sm text-gray-500 dark:text-gray-400 font-medium"
    >
      {{ formattedRupiah }}
    </p>
    
    <p
      v-else-if="hint"
      class="text-sm text-gray-500 dark:text-gray-400"
    >
      {{ hint }}
    </p>
  </div>
</template>