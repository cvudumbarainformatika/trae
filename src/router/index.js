import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import routes from './routes'
// import { createPinia } from 'pinia'

// const pinia = createPinia()



const router = createRouter({
  history: createWebHistory(),
  routes
})

function hasAccess(menuItem, userRole) {
  // console.log('menuItem', menuItem);

  if (!menuItem.permission) return true
  const allowed = menuItem.permission.split(',').map(p => p.trim().toLowerCase())
  // console.log('allowed', allowed);

  return allowed.includes(userRole.toLowerCase())
}

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  const menuStore = useMenuStore()
  const token = auth.token
  const userRole = auth.user?.role || '' // Sesuaikan dengan strukturmu

  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  if (to.name === 'login' && token) {
    return next('/admin')
  }

  // Cek apakah menu sudah dimuat
  if (!menuStore.items.length) {
    try {
      await menuStore.fetchData()
    } catch (e) {
      console.error('Gagal ambil menu:', e)
      return next('/error')
    }
  }

  // Permission check
  const allMenus = menuStore.flatten
  const matchedMenu = allMenus.find(m => m.route === to.path)
  console.log('[ROUTER] matched menu:', matchedMenu);
  console.log('[ROUTER] all menu:', allMenus);

  if (matchedMenu && !hasAccess(matchedMenu, userRole)) {
    // Coba cari menu pertama yang boleh diakses
    const firstAllowed = allMenus.find(m => hasAccess(m, userRole))
    console.log('[ROUTER] first allowed:', firstAllowed);

    if (firstAllowed) return next(firstAllowed.route)
    return next('/not-authorized')
  }

  next()
})

export default router
