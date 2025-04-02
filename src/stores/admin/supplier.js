import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'

export const useSupplierStore = defineStore('supplier', {
  state: () => ({
    suppliers: [],
    searchQuery: '',
    showSupplierForm: false,
    params: {
      page: 1,
      per_page: 10,
      sort_by: 'created_at',
      sort_direction: 'desc',
      q: ''
    },
    pagination: {
      total: 0,
      current_page: 1,
      last_page: 1
    },
    loading: false,
    error: null
  }),

  getters: {
    filteredSuppliers: (state) => {
      return state.suppliers
    },
    
    paginationInfo: (state) => {
      return {
        currentPage: state.pagination.current_page,
        totalPages: state.pagination.last_page,
        totalItems: state.pagination.total,
        itemsPerPage: state.params.per_page
      }
    }
  },

  actions: {
    setShowSupplierForm(value) {
      this.showSupplierForm = value
    },

    setSearchQuery(query) {
      this.params.q = query
      this.params.page = 1
      this.fetchSuppliers()
    },
    
    setPage(page) {
      this.params.page = page
      this.fetchSuppliers()
    },
    
    setSorting(field, direction) {
      this.params.sort_by = field
      this.params.sort_direction = direction
      this.params.page = 1
      this.fetchSuppliers()
    },
    
    setPerPage(perPage) {
      this.params.per_page = perPage
      this.params.page = 1
      this.fetchSuppliers()
    },

    async fetchSuppliers() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/api/v1/suppliers', { params: this.params })
        this.suppliers = response.data.data || []
        
        // Update pagination info
        if (response.data.meta) {
          this.pagination = {
            total: response.data.meta.total,
            current_page: response.data.meta.current_page,
            last_page: response.data.meta.last_page
          }
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
        // Make sure we include the new fields
        const dataToSend = {
          ...supplierData,
          initial_amount: supplierData.initial_amount || 0,
          current_amount: supplierData.initial_amount || 0, // Set to same as initial on creation
          notes: supplierData.notes || null
        }
        
        const response = await api.post('/api/v1/suppliers', dataToSend)
        this.suppliers.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add supplier'
        console.error('Error adding supplier:', error)
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
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update supplier'
        console.error('Error updating supplier:', error)
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
        this.suppliers = this.suppliers.filter(s => s.id !== supplierId)
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete supplier'
        console.error('Error deleting supplier:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSupplierStore, import.meta.hot))
}