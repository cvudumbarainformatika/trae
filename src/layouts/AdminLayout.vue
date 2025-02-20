<script setup>
import { useThemeStore } from '../stores/theme'
import { Home, Users, FileText, Settings } from 'lucide-vue-next'

const themeStore = useThemeStore()
</script>

<template>
  <div class="min-h-screen flex bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside class="w-[60px] bg-[#1e1e2d] flex flex-col h-screen border-r border-gray-700/50">
      <!-- Sidebar Header -->
      <div class="h-16 flex items-center justify-center bg-[#1e1e2d] border-b border-gray-700/50">
        <div class="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-700/50 transition-colors">
          <img src="/vite.svg" alt="Logo" class="w-6 h-6" />
        </div>
      </div>

      <!-- Sidebar Navigation -->
      <nav class="flex-1 p-2">
        <ul class="space-y-2">
          <li>
            <router-link
              to="/admin"
              class="flex items-center justify-center h-10 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white group relative transition-all duration-200"
              active-class="text-white bg-blue-600/20 hover:bg-blue-600/30"
              exact
            >
              <div class="flex items-center justify-center w-10 h-10">
                <Home class="w-5 h-5" />
              </div>
              <div class="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                Dashboard
              </div>
            </router-link>
          </li>
          <li>
            <router-link
              to="/admin/users"
              class="flex items-center justify-center h-10 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white group relative transition-all duration-200"
              active-class="text-white bg-blue-600/20 hover:bg-blue-600/30"
            >
              <div class="flex items-center justify-center w-10 h-10">
                <Users class="w-5 h-5" />
              </div>
              <div class="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                Users
              </div>
            </router-link>
          </li>
          <li>
            <router-link
              to="/admin/reports"
              class="flex items-center justify-center h-10 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white group relative transition-all duration-200"
              active-class="text-white bg-blue-600/20 hover:bg-blue-600/30"
            >
              <div class="flex items-center justify-center w-10 h-10">
                <FileText class="w-5 h-5" />
              </div>
              <div class="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                Reports
              </div>
            </router-link>
          </li>
          <li>
            <router-link
              to="/admin/settings"
              class="flex items-center justify-center h-10 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white group relative transition-all duration-200"
              active-class="text-white bg-blue-600/20 hover:bg-blue-600/30"
            >
              <div class="flex items-center justify-center w-10 h-10">
                <Settings class="w-5 h-5" />
              </div>
              <div class="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                Settings
              </div>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 bg-dark-900">
      <div class="flex justify-end mb-6">
        <button
          @click="themeStore.toggleTheme()"
          class="px-4 py-2 bg-gray-200 dark:bg-dark-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-dark-700 transition-colors"
        >
          {{ themeStore.isDark ? '🌞 Light' : '🌙 Dark' }}
        </button>
      </div>
      <slot></slot>
    </main>
  </div>
</template>