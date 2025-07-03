<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/admin/Sidebar.vue'

// import { useThemeStore } from '@/stores/theme'
// const themeStore = useThemeStore()

const sidebarRef = ref(null)

onMounted(() => {
  // console.log('sidebarRef', sidebarRef.value);

})

</script>

<template>
  <div class="flex h-screen bg-gray-100 dark:bg-dark-900 overflow-hidden">
    <!-- Sidebar -->
    <Sidebar ref="sidebarRef" class="w-16 h-full flex-shrink-0" />

    <!-- Main Content -->
    <main class="flex-1 p-8 overflow-hidden flex justify-center" @click="sidebarRef.hideSubmenu">
      <div class="h-ful overflow-y-auto w-full max-w-[1280px] min-w-[320px] mx-auto">
        <router-view></router-view>
      </div>
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
