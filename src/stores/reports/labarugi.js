import { acceptHMRUpdate, defineStore } from 'pinia'
import { getMonthStartDate, getMonthEndDate, formatDateIndo } from '@/utils/dateHelper'
import { api } from '@/services/api'

export const useLabaRugiStore = defineStore('report-labarugi-store', {
  state: () => ({
    data: null,
    meta: null,
    params: {
      page: 1,
      per_page: 20,
      sort_by: 'created_at',
      sort_direction: 'desc',
      q: '',
      status: 'semua',
      start_date: getMonthStartDate(),
      end_date: getMonthEndDate()
    },
    dateRange: {
      start_date: getMonthStartDate(),
      end_date: getMonthEndDate()
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
    header: (state) => {
      return {
        title: 'Laporan Laba Rugi',
        subtitle: 'Laporan Laba Rugi berdasarkan periode dan pendukung lainnya',
        periode: `<strong>Periode : </strong> ${formatDateIndo(state.params?.start_date)} - ${formatDateIndo(state.params?.end_date) }`
      }
    },
  },

  actions: {
    async fetchData() {
      this.loading = true
      try {
        const { data } = await api.get('/api/v1/reports/labarugi', {
          params: this.params
        })

        // console.log('resp labarugi', data);

        this.data = data || null
        // this.pagination.totalItems = parseInt(data?.meta?.total) || 0
        // this.meta = data?.meta || null
        return this.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch sales'
        console.error('Error fetching sales:', error)
        return []
      } finally {
        this.loading = false
      }
    },
    showDetail(item) {
      this.item = item
      this.showDetailDialog = true
    },

    closeDetailDialog() {
      this.showDetailDialog = false
    },

    setPage(page) {
      this.pagination.page = page
      this.params.page = page
      this.fetchData()
    },

    setSearchQuery(query) {
      this.params.q = query
      this.params.page = 1
      this.pagination.page = 1
      this.fetchData()
    },

    setStatusFilter(status) {
      this.params.status = status
      this.params.page = 1
      this.pagination.page = 1
      this.fetchData()
    },

    setDateRange(startDate, endDate) {
      this.params.start_date = startDate
      this.params.end_date = endDate
      this.params.page = 1
      this.pagination.page = 1
      this.fetchData()
    },

    handlePageChange(page) {
      if (page < 1 || page > Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage)) {
        return
      }
      this.pagination = {
        ...this.pagination,
        page
      }
      this.params.page = page
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLabaRugiStore, import.meta.hot))
}
