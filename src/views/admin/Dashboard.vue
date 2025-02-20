<script setup>
import { ref } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'

const stats = ref([
  { title: 'Total Users', value: '1,234', change: '+12%', trend: 'up' },
  { title: 'Revenue', value: '$12,345', change: '+8%', trend: 'up' },
  { title: 'Active Projects', value: '42', change: '-3%', trend: 'down' },
  { title: 'Conversion Rate', value: '3.24%', change: '+2%', trend: 'up' }
])
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
      
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.title }}</h3>
          <div class="mt-2 flex items-baseline">
            <span class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stat.value }}</span>
            <span
              class="ml-2 text-sm font-medium"
              :class="stat.trend === 'up' ? 'text-green-600' : 'text-red-600'"
            >
              {{ stat.change }}
            </span>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">U</div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">New user registered</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">S</div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">Sales report generated</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">4 hours ago</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white">P</div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">New project created</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">6 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>