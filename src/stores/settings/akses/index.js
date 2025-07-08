import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'

export const useAksesMenuStore = defineStore('akses-menu-store', {
  state: () => ({
    items: [],
    meta: null,
    header:{
      title: 'Akses Menu',
      subtitle: 'Daftar Akses Menu',
      placeholderSearch: 'Pencarian Akses Menu'
    },
    params: {
      page: 1,
      per_page: 10,
      sort_by: 'created_at',
      sort_direction: 'desc',
      q: '',
      status: 'semua',
      start_date: null,
      end_date: null
    },
    pagination: {
      page: 1,
      itemsPerPage: 10,
      totalItems: 0
    },
    loading: false,
    error: null,
    showCreateDialog: false,
    item: null,
    showDetailDialog: false,
    detail: null
  }),

  getters: {
    paginationInfo: (state) => {
      return {
        currentPage: state.pagination.page,
        totalPages: Math.ceil(state.pagination.totalItems / state.pagination.itemsPerPage),
        totalItems: state.pagination.totalItems,
        itemsPerPage: state.pagination.itemsPerPage
      }
    },
    filteredItems: (state) => {
      return state.items
    },
    flattenedMenus(state) {
      const flatten = (menus) => {
        let result = []
        menus.forEach(menu => {
          result.push({
            id: menu.id,
            permission: menu.permission,
            route: menu.route, // info lain kalau perlu
            label: menu.label
          })

          if (menu.children && Array.isArray(menu.children)) {
            result = result.concat(flatten(menu.children))
          }
        })
        return result
      }

      return flatten(state.items) // ← ini `state.items` adalah menus utama (array root menu)
    }
  },

  actions: {
    async fetchData() {
      this.loading = true
      try {
        const { data } = await api.get('/api/v1/settings/menu', {
          params: this.params
        })

        // console.log('return_penjualan', data);

        this.items = data?.menus || []
        this.pagination.totalItems = parseInt(data?.meta?.total) || 0
        this.meta = data?.meta || null
        return this.items
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch sales'
        console.error('Error fetching sales:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    async saveDataPermissions(payload) {
      this.loading = true
      try {
        const { data } = await api.post(`/api/v1/settings/menu/permissions`, payload)
        this.items = data
        return this.items
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch sales'
        console.error('Error fetching sales:', error)
        return []
      } finally {
        this.loading = false
      }
    },



    showDetail(item) {
      this.selectedSale = item
      this.showDetailDialog = true
    },

    closeDetailDialog() {
      this.showDetailDialog = false
    },

    setPage(page) {
      this.pagination.page = page
      this.params.page = page
      this.fetchSales()
    },

    setSearchQuery(query) {
      this.params.q = query
      this.params.page = 1
      this.pagination.page = 1
      this.fetchSales()
    },

    setStatusFilter(status) {
      this.params.status = status
      this.params.page = 1
      this.pagination.page = 1
      this.fetchSales()
    },

    setDateRange(startDate, endDate) {
      this.params.start_date = startDate
      this.params.end_date = endDate
      this.params.page = 1
      this.pagination.page = 1
      this.fetchSales()
    },

    handlePageChange(page) {
      if (page < 1 || page > Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage)) {
        return
      }
      this.pagination = {
        ...this.pagination,
        page
      }
      // this.params.page = page
      this.setPage(page)
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAksesMenuStore, import.meta.hot))
}
