<script setup>
import { ref, watch } from 'vue'
import { XIcon } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  hideClose: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: true
  },
  persistent: { // ⬅️ tambahan
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const modalRef = ref(null)
const isShaking = ref(false) // ⬅️ untuk trigger animasi


const close = () => {
  if (props.closable) {
    emit('update:modelValue', false)
    emit('close')
  }
}

const handleBackdropClick = (event) => {
  if (props.persistent) {
    // Trigger shake animation
    isShaking.value = true
    setTimeout(() => {
      isShaking.value = false
    }, 300) // durasi animasi harus sama dengan CSS
    return
  } // ⬅️ kalau persistent, abaikan klik luar
  if (event.target === modalRef.value && props.closable) {
    close()
  }
}

const sizeClasses = {
  sm: 'max-w-lg',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl'
}

// Prevent body scroll when modal is open
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}, { immediate: true })
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" ref="modalRef" @click="handleBackdropClick"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
      :class="{ 'opacity-0': !modelValue }">
      <div
        class="relative w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all transform max-h-[90vh] flex flex-col"
        :class="[sizeClasses[size], { 'shake': isShaking }]">
        <!-- Header -->
        <div class="flex-none flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <button v-if="!hideClose" @click="close"
            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none" :disabled="!closable"
            :class="{ 'opacity-50 cursor-not-allowed': !closable }">
            <XIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-4">
            <slot></slot>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer"
          class="flex-none flex items-center justify-end p-4 border-t dark:border-gray-700 space-x-2 bg-white dark:bg-gray-800 sticky bottom-0">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  20%,
  60% {
    transform: translateX(-10px);
  }

  40%,
  80% {
    transform: translateX(10px);
  }
}

.shake {
  animation: shake 0.3s ease;
}
</style>
