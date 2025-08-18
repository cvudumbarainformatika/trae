<script setup>
import { ref, defineComponent, computed, watch, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useMenuStore } from '@/stores/menu'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
// import { Package, Tag, Users, Receipt, ShoppingBag, RotateCcw, BarChart3, FileText, PieChart, Home, Database, ShoppingCart, Settings, BoxIcon, UserCheck } from 'lucide-vue-next'

const themeStore = useThemeStore()
const route = useRoute()
const activeSubmenu = ref(null)
const storeMenu = useMenuStore()
const auth = useAuthStore()



const submenus = computed(() => {
  // console.log('storeMenu.items', storeMenu.items);

  const map = {}

  for (const menu of storeMenu.items) {
    if (menu.children?.length > 0) {
      map[menu.name] = menu.children.map(child => ({
        name: child.name,
        label: child.label || child.name,
        path: child.route,
        icon: child.icon,
        allowed: !auth?.user?.role === 'root'
          ? child.permission?.split(',')?.map(r => r.trim()?.toLowerCase())?.includes(auth?.user?.role)
          : true
      }))
    }
  }
  // console.log('map', map);
  // console.log('flatten', storeMenu.flattenedMenus);

  return map
})


const isSubmenuActive = computed(() => {
  if (!submenus.value || typeof submenus.value !== 'object') return null
  return Object.entries(submenus.value).find(([key, items]) => {
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

const hideSubmenu = () => {
  activeSubmenu.value = null
}

const handleSubmenuItemClick = () => {
  // Keep submenu open when clicking items
  // Only close when clicking outside or toggling the menu button
}



defineComponent({
  name: 'Sidebar',
  emits: ['submenu-toggle']
})

defineExpose({
  hideSubmenu
})


onMounted(() => {
  // console.log('auth', auth.user);
  // console.log('submenu', submenus.value);
  // console.log('flatten', storeMenu.flattenedMenus);
})

const hasAccess = (menu) => {
  if (!auth?.user?.role === 'root') {
    return menu.permission?.split(',')?.map(r => r.trim().toLowerCase())?.includes(auth?.user?.role)

  }

  return menu

}
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
        <template v-for="menu in storeMenu.items" :key="menu.id">
          <template v-if="hasAccess(menu)">
            <li v-if="menu.children.length === 0">
              <router-link :to="menu.route"
                class="flex items-center justify-center h-10 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white group relative transition-all duration-200"
                :class="{ 'text-white bg-blue-600/20 hover:bg-blue-600/30': route.path === menu.route }">
                <div class="flex items-center justify-center w-10 h-10">

                  <Icon :is="menu.icon" :name="menu.icon" class="w-5 h-5" />
                </div>
                <div
                  class="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                  {{ menu.label }}
                </div>
              </router-link>
            </li>

            <li v-else>
              <button @click="toggleSubmenu(menu.name)"
                class="w-full flex items-center justify-center h-10 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white group relative transition-all duration-200"
                :class="{ 'text-white bg-blue-600/20 hover:bg-blue-600/30': isSubmenuActive === menu.name }">
                <div class="flex items-center justify-center w-10 h-10">

                  <Icon :is="menu.icon" :name="menu.icon" class="w-5 h-5" />
                </div>
                <div
                  class="absolute left-full ml-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                  {{ menu.label }}
                </div>
              </button>
            </li>
          </template>

        </template>


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
            Profile
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
          {{ activeSubmenu.replace('-', ' ') }}
        </div>
        <div class="space-y-1">
          <template v-for="item in submenus[activeSubmenu]" :key="item.path">
            <router-link v-if="item.allowed" :to="item.path"
              class="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-md"
              :class="{ 'bg-blue-600/20 text-white': route.path === item.path }">
              <!-- <component :is="getSubmenuIcon(item.name)" class="w-4 h-4 mr-2" /> -->
              <Icon :name="item.icon" class="w-4 h-4 mr-2" />
              {{ item.label }}
            </router-link>
          </template>
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
