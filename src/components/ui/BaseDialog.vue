<script setup>
import { computed, watchEffect } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: String,
    default: '2xl'
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  persistent: {
    type: Boolean,
    default: false
  },
  transition: {
    type: String,
    default: 'zoom'
  },
  customClass: {
    type: String,
    default: ''
  },
  isEditDialog: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'show', 'hide'])

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  if (props.persistent) return;
  if (!props.closable) return;

  show.value = false
  emit('close')
}

const dialogClasses = computed(() => ({
  'relative w-full bg-white dark:bg-dark-700 rounded-lg shadow-xl transition-all transform flex flex-col': true,
  [maxWidthClass.value]: !props.fullscreen,
  'max-h-[90vh]': !props.fullscreen,
  'h-screen w-screen rounded-none': props.fullscreen,
}))

const maxWidthClass = computed(() => ({
  'sm': 'max-w-sm',
  'md': 'max-w-md',
  'lg': 'max-w-lg',
  'xl': 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
}[props.maxWidth] || props.maxWidth))

// Tambahkan computed untuk transisi
const transitionClasses = computed(() => ({
  enter: props.fullscreen ? 'slide-enter' : 'ease-out duration-300',
  enterFrom: props.fullscreen ? 'translate-x-full' : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
  enterTo: props.fullscreen ? 'translate-x-0' : 'opacity-100 translate-y-0 sm:scale-100',
  leave: props.fullscreen ? 'slide-leave' : 'ease-in duration-200',
  leaveFrom: props.fullscreen ? 'translate-x-0' : 'opacity-100 translate-y-0 sm:scale-100',
  leaveTo: props.fullscreen ? 'translate-x-full' : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
}))

watchEffect(() => {
  if (props.modelValue) {
    emit('show')
  } else {
    emit('hide')
  }
})

</script>

<template>
  <Teleport to="body">
    <!-- Backdrop transition -->
    <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="show" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        @click="handleClose" />
    </transition>

    <!-- Dialog transition -->
    <transition :enter-active-class="transitionClasses.enter" :enter-from-class="transitionClasses.enterFrom"
      :enter-to-class="transitionClasses.enterTo" :leave-active-class="transitionClasses.leave"
      :leave-from-class="transitionClasses.leaveFrom" :leave-to-class="transitionClasses.leaveTo">
      <div v-if="show" :class="[
        'fixed inset-0 z-50 flex items-center justify-center transition-all',
        fullscreen ? 'p-0' : 'p-4',
        customClass, // Tambahkan prop customClass
        isEditDialog ? 'z-60' : '' // Tambahkan z-index lebih tinggi untuk dialog edit
      ]" @click.self="handleClose">
        <div :class="dialogClasses">
          <!-- Header -->
          <div
            class="flex-none flex items-center justify-between p-4 border-b border-secondary-200 dark:border-secondary-700">
            <h3 class="text-lg font-medium text-secondary-900 dark:text-white">
              {{ title }}
            </h3>
            <button v-if="closable" type="button"
              class="text-secondary-400 hover:text-secondary-500 dark:text-secondary-400 dark:hover:text-secondary-300 focus:outline-none"
              @click="handleClose">
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto">
            <div :class="[fullscreen ? 'h-full' : 'p-4']">
              <slot />
            </div>
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer"
            class="flex-none flex items-center justify-end p-4 border-t border-secondary-200 dark:border-secondary-700 space-x-2 bg-white dark:bg-dark-700 sticky bottom-0">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.slide-enter {
  animation: slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-leave {
  animation: slide-out 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(100%);
  }
}
</style>
