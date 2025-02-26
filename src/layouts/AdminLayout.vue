<script setup>
import { useThemeStore } from '@/stores/theme'
import Sidebar from '@/components/admin/Sidebar.vue'

const themeStore = useThemeStore()
</script>

<template>
  <div class="h-screen flex bg-gray-300 dark:bg-dark-900 overflow-hidden">
    <Sidebar />
    <!-- Main Content -->
    <main class="flex-1 p-8  h-screen flex-col max-w-screen-xl mx-auto">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Custom Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 4px;
  transition: background-color 0.2s;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}

.dark ::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background-color: rgba(75, 85, 99, 0.7);
}
</style>