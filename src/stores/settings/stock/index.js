import { acceptHMRUpdate, defineStore } from 'pinia'
import { getMonthStartDate, getMonthEndDate } from '../../../utils/dateHelper'
import {useNotification } from '@/composables/useNotification'
import { api } from '@/services/api'

export const useStockStore = defineStore('stock-store', {
  state: () => ({
    items: [],
    meta: null,
    header:{
      title: 'Manajemen Stock',
      subtitle: 'Pengaturan Mutasi & Stock Products',
      placeholderSearch: 'Cari Berdasarkan Rak, Category ...'
    },
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
    pagination: {
      page: 1,
      itemsPerPage: 20,
      totalItems: 0
    },
    loading: false,
    error: null,
    showCreateDialog: false,
    item: null,
    showDetailDialog: false,
    detail: null,
    productMutations: null,
    productMutationMeta: null
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
        const { data } = await api.get('/api/v1/products', {
          params: this.params
        })

        // console.log('stock product', data);

        this.items = data?.data || []
        if (this.items.length > 0) {
          this.items = this.items.map((item) => ({
            ...item,
            stock_fisik: item.stok_fisik ?? item.stock_akhir ?? 0,
            selisih: (item.stok_fisik ?? item.stock_akhir ?? 0) - item.stock_akhir
          }))
        }

        console.log('items', this.items);


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

    async fetchStockById(id, params) {
      this.loading = true
      try {
        const { data } = await api.get(`/api/v1/products/mutations/${id}`, {
          params
        })

        // console.log('data', data);

        this.productMutations = data.data
        this.productMutationMeta = data?.meta || null
        return data
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to fetch sale #${id}`
        console.error('Error fetching sale:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async savePenyesuaian(item) {
      // console.log('item penyesuaian', item);

      this.loading = true
      try {
        const { data } = await api.post(`/api/v1/products/stock-opname`, item)
        return data
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to fetch sale #${id}`
        console.error('Error fetching sale:', error)

        const { notify } = useNotification()
        notify({
          title: 'Error !',
          message: `Maaf Terjadi Kesalahan Simpan Barang ${item?.name || '-'}`,
          type: 'error'
        })

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
      this.fetchData()
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
  import.meta.hot.accept(acceptHMRUpdate(useStockStore, import.meta.hot))
}
