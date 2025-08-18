import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    penjualan: null,
    pembelian: null,

    cartPenjualan: null,
    cartPembelian: null,
    topProductSales: null,
    datasetSalesDaily: null,
    datasetPurchasesWeekly: null,
    activity: [],
    loading: false,

  }),

  getters: {

  },

  actions: {
    async fetchPenjualan() {
      this.loading = true
      try {
        const response = await api.get('api/v1/dashboard/penjualan')
        // console.log('response', response);

        this.penjualan = response?.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async fetchCartPenjualan() {
      this.loading = true
      try {
        const response = await api.get('api/v1/dashboard/cart-penjualan')
        // console.log('response', response);

        this.cartPenjualan = response?.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async fetchCartPembelian() {
      this.loading = true
      try {
        const response = await api.get('api/v1/dashboard/cart-pembelian')
        // console.log('response', response);

        this.cartPembelian = response?.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async fetchPembelian() {
      this.loading = true
      try {
        const response = await api.get('api/v1/dashboard/pembelian')
        // console.log('response', response);

        this.pembelian = response?.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async fetchTopProductSales() {
      this.loading = true
      try {
        const response = await api.get('api/v1/dashboard/top-product-sales')
        // console.log('response', response);

        this.topProductSales = response?.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async fetchSalesDaily() {
      this.loading = true
      try {
        const response = await api.get('api/v1/dashboard/metrics/sales-daily')
        // console.log('fetchSalesDaily', response);

        this.datasetSalesDaily = response?.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async fetchPurchasesWeekly() {
      this.loading = true
      try {
        const response = await api.get('api/v1/dashboard/metrics/purchases-weekly')
        // console.log('fetchPurchasesWeekly', response);

        // this.topProductSales = response?.data
        this.datasetPurchasesWeekly = response?.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async fetchActivity() {
      this.loading = true
      try {
        const response = await api.get('api/v1/dashboard/activity')
        // console.log('response', response);

        this.activity = response?.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },


  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDashboardStore, import.meta.hot))
}
