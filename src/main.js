import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import UIPlugin from './plugins/ui'
import { useThemeStore } from './stores/theme'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(UIPlugin)

app.mount('#app')

// Initialize theme
const themeStore = useThemeStore()
themeStore.initTheme()
