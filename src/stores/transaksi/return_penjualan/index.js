import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'

export const useReturnPenjualanStore = defineStore('return-penjualan-store', {
  state: () => ({
    items: [],
    meta: null,
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
    }
  },

  actions: {
    async fetchData() {
      this.loading = true
      try {
        const { data } = await api.get('/api/v1/return-penjualan', {
          params: this.params
        })

        // console.log('return_penjualan', data);

        this.items = data?.data || []
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

    async fetchSaleById(id) {
      this.loading = true
      try {
        const { data } = await api.get(`/api/v1/sales/${id}`)
        this.selectedSale = data
        return data
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to fetch sale #${id}`
        console.error('Error fetching sale:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteSale(id) {
      this.loading = true
      try {
        await api.delete(`/api/v1/sales/${id}`)
        this.sales = this.sales.filter(sale => sale.id !== id)
        return true
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to delete sale #${id}`
        console.error('Error deleting sale:', error)
        throw error
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
  import.meta.hot.accept(acceptHMRUpdate(useReturnPenjualanStore, import.meta.hot))
}
