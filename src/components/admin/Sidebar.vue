<script setup>
import { ref, defineComponent, computed, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useRoute } from 'vue-router'
import { Package, Tag, Users, Receipt, ShoppingBag, RotateCcw, BarChart3, FileText, PieChart, Home, Database, ShoppingCart, Settings, BoxIcon, UserCheck } from 'lucide-vue-next'

const themeStore = useThemeStore()
const route = useRoute()
const activeSubmenu = ref(null)

const submenus = {
  'master-data': [
    { name: 'Products', label: 'Produk', path: '/admin/master-data/products' },
    { name: 'Categories', label: 'Kategori', path: '/admin/master-data/categories' },
    { name: 'Satuan', label: 'Satuan', path: '/admin/master-data/satuan' },
    { name: 'Suppliers', label: 'Supplier', path: '/admin/master-data/suppliers' },
    { name: 'Customers', label: 'Pelanggan', path: '/admin/master-data/customers' }
  ],
  'transaction': [
    { name: 'PO', label: 'Order Pembelian', path: '/admin/transaksi/po' },
    { name: 'Purchases', label: 'Pembelian', path: '/admin/transaksi/pembelian' },
    { name: 'Sales', label: 'Penjualan', path: '/admin/transaksi/penjualan' },
    { name: 'Returns', label: 'Retur', path: '/admin/transaction/returns' }
  ],
  'reports': [
    { name: 'Sales Report', path: '/admin/reports/sales' },
    { name: 'Inventory Report', path: '/admin/reports/inventory' },
    { name: 'Financial Report', path: '/admin/reports/financial' }
  ]
}

const isSubmenuActive = computed(() => {
  return Object.entries(submenus).find(([key, items]) => {
    return items.some(item => route.path.startsWith(item.path))
  })?.[0] || null
})

// Watch for route changes to update active submenu
watch(() => route.path, () => {
  // Close submenu when route changes
  activeSubmenu.value = null
}, { immediate: true })

const toggleSubmenu = (menu) => {
  if (activeSubmenu.value === menu) {
    activeSubmenu.value = null
  } else {
    activeSubmenu.value = menu
  }
}

const handleSubmenuItemClick = () => {
  // Keep submenu open when clicking items
  // Only close when clicking outside or toggling the menu button
}

const getSubmenuIcon = (name) => {
  const iconMap = {
    'Products': Package,
    'Categories': Tag,
    'Suppliers': Users,
    'Customers': UserCheck, // Menggunakan ikon UserCheck untuk Customers
    'Sales': Receipt,
    'Purchases': ShoppingBag,
    'PO': ShoppingBag,
    'Returns': RotateCcw,
    'Sales Report': BarChart3,
    'Inventory Report': BoxIcon,
    'Financial Report': PieChart
  }
  return iconMap[name] || FileText
}

defineComponent({
  name: 'Sidebar',
  emits: ['submenu-toggle']
})
</script>

<template>
  <aside class="w-[60px] bg-dark-700 flex flex-col h-screen border-r border-gray-700/50 relative">
    <!-- Sidebar Header -->
    <div class="h-16 flex items-center justify-center border-b border-gray-700/50">
      <div class="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-700/50 transition-colors">
        <img src="/vite.svg" alt="Logo" class="w-6 h-6" />
      </div>
    </div>

    <!-- Sidebar Navigation -->
    <nav class="flex-1 p-2 flex flex-col">
      <ul class="space-y-2">
        <li>
          <router-link to="/admin"
            class="flex items-center justify-center h-10 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white group relative transition-all duration-200"
            :class="{ 'text-white bg-blue-600/20 hover:bg-blue-600/30': route.path === '/admin' }">
            <div class="flex items-center justify-center w-10 h-10">
              <Home class="w-5 h-5" />
            </div>
            <div
              class="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
              Dashboard
            </div>
          </router-link>
        </li>
        <li>
          <button @click="toggleSubmenu('master-data')"
            class="w-full flex items-center justify-center h-10 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white group relative transition-all duration-200"
            :class="{ 'text-white bg-blue-600/20 hover:bg-blue-600/30': isSubmenuActive === 'master-data' || activeSubmenu === 'master-data' }">
            <div class="flex items-center justify-center w-10 h-10">
              <Database class="w-5 h-5" />
            </div>
            <div
              class="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
              Master Data
            </div>
          </button>
        </li>
        <li>
          <button @click="toggleSubmenu('transaction')"
            class="w-full flex items-center justify-center h-10 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white group relative transition-all duration-200"
            :class="{ 'text-white bg-blue-600/20 hover:bg-blue-600/30': isSubmenuActive === 'transaction' || activeSubmenu === 'transaction' }">
            <div class="flex items-center justify-center w-10 h-10">
              <ShoppingCart class="w-5 h-5" />
            </div>
            <div
              class="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
              Transaksi
            </div>
          </button>
        </li>
        <li>
          <button @click="toggleSubmenu('reports')"
            class="w-full flex items-center justify-center h-10 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white group relative transition-all duration-200"
            :class="{ 'text-white bg-blue-600/20 hover:bg-blue-600/30': isSubmenuActive === 'reports' || activeSubmenu === 'reports' }">
            <div class="flex items-center justify-center w-10 h-10">
              <FileText class="w-5 h-5" />
            </div>
            <div
              class="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
              Laporan
            </div>
          </button>
        </li>
        <li>
          <router-link to="/admin/settings"
            class="flex items-center justify-center h-10 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white group relative transition-all duration-200"
            active-class="text-white bg-blue-600/20 hover:bg-blue-600/30">
            <div class="flex items-center justify-center w-10 h-10">
              <Settings class="w-5 h-5" />
            </div>
            <div
              class="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
              Settings
            </div>
          </router-link>
        </li>
      </ul>
      <div class="mt-auto mb-10">
        <router-link to="/admin/profile"
          class="flex items-center justify-center h-10 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white group relative transition-all duration-200"
          active-class="text-white bg-blue-600/20 hover:bg-blue-600/30">
          <div class="flex items-center justify-center w-10 h-10">
            <Icon name="user" class="w-5 h-5" />
          </div>
          <div
            class="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
            Settings
          </div>
        </router-link>
      </div>
    </nav>

    <!-- Submenu -->
    <div v-if="activeSubmenu"
      class="absolute left-[60px] top-0 w-64 bg-gray-800 rounded-r-lg shadow-lg overflow-hidden z-50 h-screen"
      style="animation: slideIn 0.2s ease-out;">
      <div class="px-2 py-2 h-full overflow-y-auto">
        <div class="text-sm font-bold text-gray-300 uppercase tracking-wider px-3 mb-4">
          {{ activeSubmenu.replace('-', '') }}
        </div>
        <div class="space-y-1">
          <router-link v-for="item in submenus[activeSubmenu]" :key="item.path" :to="item.path"
            class="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-md"
            :class="{ 'bg-blue-600/20 text-white': route.path === item.path }">
            <component :is="getSubmenuIcon(item.name)" class="w-4 h-4 mr-2" />
            {{ item.name }}
          </router-link>
        </div>
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
