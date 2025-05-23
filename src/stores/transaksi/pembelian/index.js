import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'

export const usePurchaseStore = defineStore('purchase', {
  state: () => ({
    purchases: [],
    meta:null,
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
    selectedPurchase: null,
    showDetailDialog: false
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

    filteredPurchases: (state) => {
      return state.purchases
    }
  },

  actions: {
    async fetchPurchases() {
      this.loading = true

      try {
        const { data } = await api.get('/api/v1/purchases', {
          params: this.params
        })

        this.purchases = data?.data || []
        this.pagination.totalItems = parseInt(data?.meta?.total) || 0
        this.meta = data?.meta || null
        return this.purchases
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch purchases'
        console.error('Error fetching purchases:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    async fetchPurchaseById(id) {
      this.loading = true

      try {
        const { data } = await api.get(`/api/v1/purchases/${id}`)
        this.selectedPurchase = data
        return data
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to fetch purchase #${id}`
        console.error('Error fetching purchase:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deletePurchase(id) {
      this.loading = true

      try {
        await api.delete(`/api/v1/purchases/${id}`)
        // Remove from local array
        this.purchases = this.purchases.filter(purchase => purchase.id !== id)
        return true
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to delete purchase #${id}`
        console.error('Error deleting purchase:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePurchaseStatus(id, status) {
      this.loading = true

      try {
        const { data } = await api.put(`/api/v1/purchases/${id}/status`, { status })

        // Update in local array
        const index = this.purchases.findIndex(purchase => purchase.id === id)
        if (index !== -1) {
          this.purchases[index].status = status
        }

        return data
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to update purchase status`
        console.error('Error updating purchase status:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    setPage(page) {
      this.pagination.page = page
      this.params.page = page
      this.fetchPurchases()
    },

    setSearchQuery(query) {
      this.params.q = query
      this.params.page = 1
      this.pagination.page = 1
      this.fetchPurchases()
    },

    setStatusFilter(status) {
      this.params.status = status
      this.params.page = 1
      this.pagination.page = 1
      this.fetchPurchases()
    },

    setDateRange(startDate, endDate) {
      this.params.start_date = startDate
      this.params.end_date = endDate
      this.params.page = 1
      this.pagination.page = 1
      this.fetchPurchases()
    },

    handlePageChange (page) {
      if (page < 1 || page > Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage)) {
        return
      }

      this.pagination = {
        ...this.pagination,
        page
      }

      this.params.page = page

      // this.fetchPurchases()
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePurchaseStore, import.meta.hot))
}
