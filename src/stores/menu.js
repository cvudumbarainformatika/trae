import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useMenuStore = defineStore('menu-store', {
  state: () => ({
    items: [],
    flatten : []
  }),
  getters: {
    flattenedMenus(state) {
      // const flatten = (menus) => {
        const paths = []
        const flatten = state.items || []
        flatten.forEach(menu => {
          if (menu.path) paths.push(menu)
          if (menu.children) {
            paths.push(...flatten)
          }
        })

        return paths
    }
  },
  actions: {
    async fetchData() {
      await api.get('/api/v1/menu').then((response) => {
        // console.log('menus', response.data);
        this.items = response.data?.menus
        this.flatten = response.data?.flatten
        // console.log('items', this.flattenedMenus);

      })
    }
  }
})
