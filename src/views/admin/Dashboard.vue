<script setup>
import { ref } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { useThemeStore } from '../../stores/theme'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const themeStore = useThemeStore()

const stats = ref([
  { title: 'Total Users', value: '1,234', change: '+12%', trend: 'up' },
  { title: 'Revenue', value: '$12,345', change: '+8%', trend: 'up' },
  { title: 'Active Projects', value: '42', change: '-3%', trend: 'down' },
  { title: 'Conversion Rate', value: '3.24%', change: '+2%', trend: 'up' }
])
</script>

<template>
    <div class="flex flex-col h-full space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
        <BaseButton
          @click="themeStore.toggleTheme()"
          class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {{ themeStore.isDark ? '🌞 Light' : '🌙 Dark' }}
        </BaseButton>
      </div>
      
      <div class="flex-1 h-full space-y-4 overflow-y-auto">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            v-for="(stat, index) in stats"
            :key="index"
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
          </Card>
        </div>

        <!-- Recent Activity -->
        <Card class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
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
        </Card>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Sales Overview">
            <div class="h-64">
              <Line
                :data="{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [{
                    label: 'Sales',
                    data: [65, 59, 80, 81, 56, 55],
                    borderColor: '#3B82F6',
                    tension: 0.1
                  }]
                }"
                :options="{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: '#9CA3AF'
                      }
                    }
                  },
                  scales: {
                    y: {
                      ticks: { color: '#9CA3AF' },
                      grid: { color: '#374151' }
                    },
                    x: {
                      ticks: { color: '#9CA3AF' },
                      grid: { color: '#374151' }
                    }
                  }
                }"
              />
            </div>
          </Card>

          <Card title="Tasks">
            <div class="space-y-3">
              <div class="flex items-center">
                <input type="checkbox" class="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600">
                <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">Review new orders</span>
                <span class="ml-auto text-xs text-gray-500">Today</span>
              </div>
              <div class="flex items-center">
                <input type="checkbox" class="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600" checked>
                <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">Update inventory</span>
                <span class="ml-auto text-xs text-gray-500">Yesterday</span>
              </div>
              <div class="flex items-center">
                <input type="checkbox" class="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600">
                <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">Prepare monthly report</span>
                <span class="ml-auto text-xs text-gray-500">Tomorrow</span>
              </div>
              <div class="flex items-center">
                <input type="checkbox" class="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600">
                <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">Contact suppliers</span>
                <span class="ml-auto text-xs text-gray-500">Next week</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
</template>