<template>
  <div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
    <transition-group name="notification-fade" tag="div">
      <div v-for="notification in notifications" :key="notification.id"
           class="mb-3 overflow-hidden rounded-lg shadow-xl backdrop-blur-sm max-w-md notification-item"
           :class="{
             'bg-gradient-to-r from-green-500/90 to-green-600/90 border-l-4 border-green-700': notification.type === 'success',
             'bg-gradient-to-r from-red-500/90 to-red-600/90 border-l-4 border-red-700': notification.type === 'error',
             'bg-gradient-to-r from-yellow-500/90 to-yellow-600/90 border-l-4 border-yellow-700': notification.type === 'warning',
             'bg-gradient-to-r from-blue-500/90 to-blue-600/90 border-l-4 border-blue-700': notification.type === 'info'
           }"
      >
        <!-- Progress bar -->
        <div
          class="h-1 bg-white/30"
          :class="{
            'animate-progress': notification.timeout > 0
          }"
          :style="{
            'animation-duration': `${notification.timeout}ms`,
            'transform-origin': 'left'
          }"
        ></div>

        <!-- Content -->
        <div class="p-4 flex items-start">
          <!-- Icon -->
          <div class="mr-3 text-white">
            <Icon
              :name="getNotificationIcon(notification.type)"
              class="w-6 h-6 notification-icon"
            />
          </div>

          <!-- Text -->
          <div class="flex-1">
            <h3 class="font-medium text-white text-base">{{ notification.title }}</h3>
            <p class="text-white/90 text-sm mt-1">{{ notification.message }}</p>
          </div>

          <!-- Close button -->
          <button
            @click="removeNotification(notification.id)"
            class="ml-2 text-white/70 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/10 p-1"
          >
            <Icon name="X" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotification } from '@/composables/useNotification'
import Icon from '@/components/ui/Icon.vue'

const { notifications, removeNotification } = useNotification()

/**
 * Get appropriate icon based on notification type
 */
const getNotificationIcon = (type) => {
  switch (type) {
    case 'success':
      return 'CheckCircle'
    case 'error':
      return 'AlertCircle'
    case 'warning':
      return 'AlertTriangle'
    case 'info':
    default:
      return 'Info' // Ubah dari 'InformationCircle' menjadi 'Info'
  }
}
</script>

<style scoped>
/* Notification animations */
.notification-fade-enter-active {
  animation: notification-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.notification-fade-leave-active {
  animation: notification-out 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}
@keyframes notification-in {
  0% {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes notification-out {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
}

/* Progress bar animation */
@keyframes progress {
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}
.animate-progress {
  animation-name: progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

/* Icon animation */
.notification-icon {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Glass effect */
.notification-item {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-radius: 0.5rem;
  position: relative;
  overflow: hidden;
}
</style>
