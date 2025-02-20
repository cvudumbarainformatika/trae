import { defineAsyncComponent } from 'vue'

export default {
  install: (app) => {
    // Get all .vue files from all component directories
    const components = {
      ...import.meta.glob('../components/*.vue'),
      ...import.meta.glob('../components/ui/*.vue'),
      ...import.meta.glob('../components/admin/*.vue')
    }

    // Register each component globally
    for (const path in components) {
      const componentName = path.split('/').pop().replace(/.vue$/, '')
      app.component(componentName, defineAsyncComponent(components[path]))
    }
  }
}