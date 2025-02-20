<script setup>
import { ref } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { Home, Database, ShoppingCart, FileText, Settings } from 'lucide-vue-next'

const themeStore = useThemeStore()
const activeSubmenu = ref(null)

const submenus = {
  'master-data': [
    { name: 'Products', path: '/admin/master-data/products' },
    { name: 'Categories', path: '/admin/master-data/categories' },
    { name: 'Suppliers', path: '/admin/master-data/suppliers' }
  ],
  'transaction': [
    { name: 'Sales', path: '/admin/transaction/sales' },
    { name: 'Purchases', path: '/admin/transaction/purchases' },
    { name: 'Returns', path: '/admin/transaction/returns' }
  ],
  'reports': [
    { name: 'Sales Report', path: '/admin/reports/sales' },
    { name: 'Inventory Report', path: '/admin/reports/inventory' },
    { name: 'Financial Report', path: '/admin/reports/financial' }
  ]
}

const toggleSubmenu = (menu) => {
  activeSubmenu.value = activeSubmenu.value === menu ? null : menu
}
</script>

<template>
  <aside class="fixed w-[60px] bg-gray-900 flex flex-col h-screen border-r border-gray-700/50 relative">
    <!-- Sidebar Header -->
    <div class="h-16 flex items-center justify-center border-b border-gray-700/50">
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
          <button
            @click="toggleSubmenu('master-data')"
            class="w-full flex items-center justify-center h-10 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white group relative transition-all duration-200"
            :class="{ 'text-white bg-blue-600/20 hover:bg-blue-600/30': activeSubmenu === 'master-data' }"
          >
            <div class="flex items-center justify-center w-10 h-10">
              <Database class="w-5 h-5" />
            </div>
            <div class="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
              Master Data
            </div>
          </button>
        </li>
        <li>
          <button
            @click="toggleSubmenu('transaction')"
            class="w-full flex items-center justify-center h-10 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white group relative transition-all duration-200"
            :class="{ 'text-white bg-blue-600/20 hover:bg-blue-600/30': activeSubmenu === 'transaction' }"
          >
            <div class="flex items-center justify-center w-10 h-10">
              <ShoppingCart class="w-5 h-5" />
            </div>
            <div class="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
              Transaksi
            </div>
          </button>
        </li>
        <li>
          <button
            @click="toggleSubmenu('reports')"
            class="w-full flex items-center justify-center h-10 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white group relative transition-all duration-200"
            :class="{ 'text-white bg-blue-600/20 hover:bg-blue-600/30': activeSubmenu === 'reports' }"
          >
            <div class="flex items-center justify-center w-10 h-10">
              <FileText class="w-5 h-5" />
            </div>
            <div class="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
              Laporan
            </div>
          </button>
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

    <!-- Submenu -->
    <div
      v-if="activeSubmenu"
      class="absolute left-full top-0 ml-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
      style="animation: slideIn 0.2s ease-out;"
    >
      <div class="py-2">
        <router-link
          v-for="item in submenus[activeSubmenu]"
          :key="item.path"
          :to="item.path"
          class="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-600/20 hover:text-white transition-colors"
          @click="activeSubmenu = null"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </aside>
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
</style>