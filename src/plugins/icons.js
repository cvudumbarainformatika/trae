import * as LucideIcons from 'lucide-vue-next'

export default {
  install: (app) => {
    // Register all Lucide icons globally
    for (const [iconName, iconComponent] of Object.entries(LucideIcons)) {
      if (iconName !== 'createIcons') {
        app.component(iconName, iconComponent)
      }
    }
  }
}