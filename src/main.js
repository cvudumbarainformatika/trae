import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import './style.css'
import App from './App.vue'
import UIPlugin from './plugins/ui'
// import IconsPlugin from './plugins/icons'
import { useThemeStore } from './stores/theme'
import { htmlSafe } from './directives/htmlSafe'



// localStorage.removeItem('auth-store')
// localStorage.removeItem('salesFormWitTabs')


const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(UIPlugin)
// app.use(IconsPlugin)

app.mount('#app')

// Initialize theme
const themeStore = useThemeStore()
themeStore.initTheme()

app.directive('html-safe', htmlSafe)
