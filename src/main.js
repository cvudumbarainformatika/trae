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

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(pinia)
app.use(UIPlugin)
// app.use(IconsPlugin)

app.mount('#app')

// Initialize theme
const themeStore = useThemeStore()
themeStore.initTheme()

app.directive('html-safe', htmlSafe)
