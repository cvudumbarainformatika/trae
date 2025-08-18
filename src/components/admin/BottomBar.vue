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


const startY = ref(0)
const currentY = ref(0)
const translateY = ref(0)



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




const handleTouchStart = (e) => {
  startY.value = e.touches[0].clientY
}

const handleTouchMove = (e) => {
  currentY.value = e.touches[0].clientY
  translateY.value = Math.max(0, currentY.value - startY.value)
}

const handleTouchEnd = () => {
  if (translateY.value > 100) {
    // jika geser lebih dari 100px → tutup
    activeSubmenu.value = null
  }
  translateY.value = 0
}
</script>

<template>
  <!-- Bottom bar -->
  <div
    class="md:hidden fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 flex justify-around items-center h-14 z-50">
    <template v-for="menu in storeMenu?.items" :key="menu?.id">
      <template v-if="hasAccess(menu)">
        <!-- Menu tanpa anak -->
        <router-link v-if="menu?.children?.length === 0" :to="menu?.route"
          class="flex flex-col items-center justify-center text-gray-400 hover:text-white transition-all"
          :class="{ 'text-blue-500': route?.path === menu?.route }">
          <Icon :name="menu.icon" class="w-5 h-5" />
          <!-- <span class="text-[10px]">{{ menu.label }}</span> -->
        </router-link>

        <!-- Menu dengan anak -->
        <button v-else @click="toggleSubmenu(menu?.name)"
          class="flex flex-col items-center justify-center text-gray-400 hover:text-white transition-all"
          :class="{ 'text-blue-500': activeSubmenu === menu?.name }">
          <Icon :name="menu?.icon" class="w-5 h-5" />
          <!-- <span class="text-[10px]">{{ menu.label }}</span> -->
        </button>
      </template>
    </template>
  </div>


  <!-- Overlay (background blur & gelap) -->
  <transition name="fade">
    <div v-if="activeSubmenu" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" @click="activeSubmenu = null">
    </div>
  </transition>

  <!-- Slide-up modal submenu -->
  <transition name="slide-up">
    <div v-if="activeSubmenu" class="fixed bottom-0 left-0 w-full bg-gray-800 rounded-t-2xl shadow-lg z-40 pb-20"
      :style="{ transform: `translateY(${translateY}px)` }" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
      @touchend="handleTouchEnd">
      <!-- Drag/close handle -->
      <div class="flex justify-center py-2">
        <div class="w-12 h-1.5 bg-gray-600 rounded-full"></div>
      </div>

      <div class="px-4 py-3 max-h-[60vh] overflow-y-auto">
        <div class="font-bold text-gray-300 text-sm mb-3 uppercase tracking-wide">
          {{ activeSubmenu?.replace('-', ' ') }}
        </div>
        <!-- <div class="space-y-2">
          <template v-for="item in submenus[activeSubmenu]" :key="item?.path">
            <router-link v-if="item?.allowed" :to="item?.path" @click="activeSubmenu = null"
              class="block px-4 py-3 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 hover:text-white transition"
              :class="{ 'bg-blue-600/20 text-white': route.path === item?.path }">
              <div class="flex items-center gap-2">
                <Icon :name="item?.icon" class="w-4 h-4" />
                {{ item?.label }}
              </div>
            </router-link>
          </template>
        </div> -->

        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <template v-for="item in submenus[activeSubmenu]" :key="item?.path">
            <router-link v-if="item?.allowed" :to="item?.path" @click="activeSubmenu = null" class="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-700 text-gray-200
             hover:bg-blue-600/20 hover:text-white shadow-sm hover:shadow-md
             transition duration-200 transform hover:scale-105"
              :class="{ 'bg-blue-600/30 text-white ring-2 ring-blue-500': route.path === item?.path }"
              :title="item?.label">
              <!-- Icon -->
              <Icon :name="item?.icon" class="w-10 h-10 mb-2" />

              <!-- Label (rapi & handle panjang) -->
              <span class="text-xs font-medium text-center truncate w-full">
                {{ item?.label }}
              </span>
            </router-link>
          </template>
        </div>


      </div>
    </div>
  </transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
