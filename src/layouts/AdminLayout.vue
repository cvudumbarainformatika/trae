<script setup>
import { ref } from 'vue'
import { useThemeStore } from '../stores/theme'
import Sidebar from '../components/admin/Sidebar.vue'

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
  <div class="min-h-screen flex bg-gray-100 dark:bg-gray-900 overflow-hidden">
    <Sidebar />
    <!-- Main Content -->
    <main class="flex-1 p-8 bg-gray-300 dark:bg-dark-900 overflow-y-auto h-screen">
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
</style>