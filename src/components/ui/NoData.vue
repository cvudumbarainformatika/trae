<script setup>
import { computed } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  message: {
    type: String,
    default: 'No data available'
  },
  icon: {
    type: String,
    default: 'Database'
  },
  description: {
    type: String,
    default: ''
  },
})

const iconSize = computed(() => {
  return window.innerWidth < 640 ? 'w-24 h-24' : 'w-32 h-32'
})
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full h-full min-h-[400px] p-4 relative overflow-hidden">
    <!-- Animated background gradient -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-primary-50/30 to-gray-100/50 dark:from-dark-800/50 dark:via-primary-900/30 dark:to-dark-700/50 animate-gradient">
    </div>

    <!-- Decorative circles -->
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-30 dark:opacity-20">
      <div class="absolute inset-0 border-2 border-primary-200 dark:border-primary-800 rounded-full animate-pulse">
      </div>
      <div class="absolute inset-8 border border-primary-100 dark:border-primary-900 rounded-full animate-ping"></div>
    </div>

    <!-- Content container -->
    <div class="relative z-5 flex flex-col items-center space-y-6 text-center max-w-lg mx-auto">
      <!-- Icon with glowing effect -->
      <div class="relative">
        <div class="absolute inset-0 bg-primary-500/20 dark:bg-primary-500/10 blur-xl rounded-full animate-pulse"></div>
        <Icon :name="icon"
          :class="[iconSize, 'text-primary-500/80 dark:text-primary-400/80 transform transition-all duration-700 hover:scale-110 hover:text-primary-600 dark:hover:text-primary-300']" />
      </div>

      <!-- Message -->
      <h3 class="text-xl sm:text-2xl font-medium text-gray-700 dark:text-gray-200 tracking-wide">
        {{ message }}
      </h3>

      <!-- Optional description -->
      <p v-if="description" class="text-sm sm:text-base text-gray-500 dark:text-gray-400">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.animate-gradient {
  background-size: 400% 400%;
  animation: gradient 8s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
