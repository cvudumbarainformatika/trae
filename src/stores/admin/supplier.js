import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'

export const useSupplierStore = defineStore('supplier', {
  state: () => ({
    suppliers: [],
    loading: false,
    error: null,
    showSupplierForm: false,
    showDeleteConfirm: false,
    searchQuery: '',
    filters: {
      q: '',
      sort_by: 'name',
      sort_dir: 'asc',
      per_page: 12
    },
    pagination: {
      currentPage: 1,
      itemsPerPage: 12,
      total: 0,
      maxVisiblePages: 5
    }
  }),

  getters: {
    filteredSuppliers: (state) => {
      return state.suppliers.filter(supplier => {
        if (!state.searchQuery) return true
        
        const query = state.searchQuery.toLowerCase()
        return (
          supplier.name.toLowerCase().includes(query) ||
          supplier.address?.toLowerCase().includes(query) ||
          supplier.phone?.toLowerCase().includes(query) ||
          supplier.email?.toLowerCase().includes(query)
        )
      })
    },

    paginationInfo: (state) => {
      const totalItems = state.pagination?.total
      const totalPages = Math.ceil(totalItems / state.pagination.itemsPerPage)

      let startPage = Math.max(1, state.pagination.currentPage - Math.floor(state.pagination.maxVisiblePages / 2))
      let endPage = Math.min(totalPages, startPage + state.pagination.maxVisiblePages - 1)

      if (endPage - startPage + 1 < state.pagination.maxVisiblePages) {
        startPage = Math.max(1, endPage - state.pagination.maxVisiblePages + 1)
      }

      return {
        currentPage: state.pagination?.currentPage,
        totalPages,
        itemsPerPage: state.pagination?.itemsPerPage,
        startPage,
        endPage,
        totalItems,
        maxVisiblePages: state.pagination?.maxVisiblePages
      }
    }
  },

  actions: {
    async fetchSuppliers() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/api/v1/suppliers', {
          params: {
            page: this.pagination.currentPage,
            per_page: this.pagination.itemsPerPage,
            ...this.filters
          }
        })
        this.suppliers = response.data?.data || []
        this.pagination = {
          ...this.pagination,
          currentPage: response.data?.meta?.current_page || 1,
          total: response.data?.meta?.total || 0
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch suppliers'
        console.error('Error fetching suppliers:', error)
      } finally {
        this.loading = false
      }
    },

    async addSupplier(supplierData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/api/v1/suppliers', supplierData)
        this.suppliers.push(response.data)
        this.showSupplierForm = false
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add supplier'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateSupplier(supplierData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.put(`/api/v1/suppliers/${supplierData.id}`, supplierData)
        const index = this.suppliers.findIndex(s => s.id === supplierData.id)
        if (index !== -1) {
          this.suppliers[index] = response.data
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update supplier'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteSupplier(supplierId) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/api/v1/suppliers/${supplierId}`)
        const index = this.suppliers.findIndex(s => s.id === supplierId)
        if (index !== -1) {
          this.suppliers.splice(index, 1)
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete supplier'
        throw error
      } finally {
        this.loading = false
      }
    },

    setShowSupplierForm(show) {
      this.showSupplierForm = show
    },

    setSearchQuery(query) {
      this.searchQuery = query
      this.pagination.currentPage = 1
      this.fetchSuppliers()
    },

    setCurrentPage(page) {
      this.pagination.currentPage = page
      this.fetchSuppliers()
    },

    resetFilters() {
      this.filters = {
        q: '',
        sort_by: 'name',
        sort_dir: 'asc',
        per_page: this.pagination.itemsPerPage
      }
      this.pagination.currentPage = 1
      this.fetchSuppliers()
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSupplierStore, import.meta.hot))
}