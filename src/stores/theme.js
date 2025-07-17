import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: true
  }),
  persist: true,
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      // localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', this.isDark)
    },
    initTheme() {
      document.documentElement.classList.toggle('dark', this.isDark)
    }
  }
})
