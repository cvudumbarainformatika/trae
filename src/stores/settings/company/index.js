import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'

export const useCompanyStore = defineStore('company-store', {
  state: () => ({
    item: null,
    meta: null,
    header:{
      title: 'Setting Company',
      subtitle: 'Pengaturan Aplikasi Toko (Bio)',
      placeholderSearch: ''
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
    detail: null,
    form:{
      id: null,
      name: null,
      email: null,
      phone: null,
      address: null,
      logo: null,
    }
  }),

  persist: true,

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

  },

  actions: {
    async fetchData() {
      this.loading = true
      try {
        const { data } = await api.get('/api/v1/settings/company')

        // console.log('company', data);

        this.item = data
        this.form = { ...data }

        return this.item
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch company'
        console.error('Error fetching company:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    async saveData() {
      this.loading = true
      try {
        const { data } = await api.put(`/api/v1/settings/company`, this.form)
        this.items = data
        this.form = { ...data.data }
        return this.items
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch sales'
        console.error('Error fetching company:', error)
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
  import.meta.hot.accept(acceptHMRUpdate(useCompanyStore, import.meta.hot))
}
