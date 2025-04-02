import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [],
    searchQuery: '',
    showCustomerForm: false,
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
    filteredCustomers: (state) => {
      return state.customers
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
    setShowCustomerForm(value) {
      this.showCustomerForm = value
    },

    setSearchQuery(query) {
      this.params.q = query
      this.params.page = 1
      this.fetchCustomers()
    },
    
    setPage(page) {
      this.params.page = page
      this.fetchCustomers()
    },
    
    setSorting(field, direction) {
      this.params.sort_by = field
      this.params.sort_direction = direction
      this.params.page = 1
      this.fetchCustomers()
    },
    
    setPerPage(perPage) {
      this.params.per_page = perPage
      this.params.page = 1
      this.fetchCustomers()
    },

    async fetchCustomers() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/api/v1/customers', { params: this.params })
        this.customers = response.data.data || []
        
        // Update pagination info
        if (response.data.meta) {
          this.pagination = {
            total: response.data.meta.total,
            current_page: response.data.meta.current_page,
            last_page: response.data.meta.last_page
          }
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Gagal mengambil data pelanggan'
        console.error('Error fetching customers:', error)
      } finally {
        this.loading = false
      }
    },

    async addCustomer(customerData) {
      this.loading = true
      this.error = null
      try {
        // Menyesuaikan data untuk format API
        const dataToSend = {
          ...customerData,
          initial_amount: customerData.initial_amount || 0,
          current_amount: customerData.initial_amount || 0, // Set sama dengan initial pada pembuatan
          notes: customerData.notes || null
        }
        
        const response = await api.post('/api/v1/customers', dataToSend)
        this.customers.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Gagal menambahkan pelanggan'
        console.error('Error adding customer:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCustomer(customerData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.put(`/api/v1/customers/${customerData.id}`, customerData)
        const index = this.customers.findIndex(c => c.id === customerData.id)
        if (index !== -1) {
          this.customers[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Gagal memperbarui pelanggan'
        console.error('Error updating customer:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCustomer(customerId) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/api/v1/customers/${customerId}`)
        this.customers = this.customers.filter(c => c.id !== customerId)
      } catch (error) {
        this.error = error.response?.data?.message || 'Gagal menghapus pelanggan'
        console.error('Error deleting customer:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCustomerStore, import.meta.hot))
}