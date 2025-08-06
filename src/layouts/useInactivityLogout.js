import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export function useInactivityLogout(timeout = 1 * 60 * 60 * 1000) { // default: 2 jam
  let timer = null

  const router = useRouter()

  const resetTimer = () => {
    // console.log('reset timer');

    clearTimeout(timer)
    timer = setTimeout(() => {
      const auth = useAuthStore()
      auth.logout().then(() => {
        router.push('/login')
      })
    }, timeout)
  }

  const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart']

  const setup = () => {
    events.forEach(event => {
      window.addEventListener(event, resetTimer)
    })
    resetTimer()
  }

  const cleanup = () => {
    events.forEach(event => {
      window.removeEventListener(event, resetTimer)
    })
    clearTimeout(timer)
  }

  onMounted(setup)
  onUnmounted(cleanup)
}
