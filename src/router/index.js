import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import routes from './routes'
// import { createPinia } from 'pinia'

// const pinia = createPinia()



const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const token = auth.token

  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  if (to.name === 'login' && token) {
    return next('/admin')
  }

  next()
})

export default router
