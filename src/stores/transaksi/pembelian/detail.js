import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const usePurchaseDetailStore = defineStore('purchaseDetail', {
  state: () => ({
    purchase: null,
    loading: false,
    error: null,
    showConfirmDialog: false,
    showCancelDialog: false,
    showPrintDialog: false
  }),

  getters: {
    canEdit: (state) => {
      return state.purchase && state.purchase.status === 'pending'
    },
    
    canCancel: (state) => {
      return state.purchase && ['pending', 'partial'].includes(state.purchase.status)
    },
    
    canComplete: (state) => {
      return state.purchase && ['pending', 'partial'].includes(state.purchase.status)
    },
    
    totalAmount: (state) => {
      if (!state.purchase) return 0
      
      const subtotal = state.purchase.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
      )
      
      const discountAmount = state.purchase.discount || 0
      const taxAmount = subtotal * (state.purchase.tax || 0) / 100
      
      return subtotal - discountAmount + taxAmount
    }
  },

  actions: {
    async fetchPurchase(id) {
      this.loading = true
      
      try {
        const { data } = await api.get(`/api/v1/purchases/${id}`)
        this.purchase = data
        return data
      } catch (error) {
        this.error = error.response?.data?.message || `Failed to fetch purchase #${id}`
        console.error('Error fetching purchase:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async completePurchase() {
      if (!this.purchase) return
      
      this.loading = true
      
      try {
        const { data } = await api.put(`/api/v1/purchases/${this.purchase.id}/complete`)
        this.purchase.status = 'completed'
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to complete purchase'
        console.error('Error completing purchase:', error)
        throw error
      } finally {
        this.loading = false
        this.showConfirmDialog = false
      }
    },
    
    async cancelPurchase() {
      if (!this.purchase) return
      
      this.loading = true
      
      try {
        const { data } = await api.put(`/api/v1/purchases/${this.purchase.id}/cancel`)
        this.purchase.status = 'cancelled'
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to cancel purchase'
        console.error('Error cancelling purchase:', error)
        throw error
      } finally {
        this.loading = false
        this.showCancelDialog = false
      }
    },
    
    async printPurchase() {
      if (!this.purchase) return
      
      this.loading = true
      
      try {
        const response = await api.get(`/api/v1/purchases/${this.purchase.id}/print`, {
          responseType: 'blob'
        })
        
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `purchase-${this.purchase.purchase_number}.pdf`)
        document.body.appendChild(link)
        link.click()
        
        // Clean up
        link.parentNode.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        return true
      } catch (error) {
        this.error = 'Failed to generate purchase print'
        console.error('Error printing purchase:', error)
        throw error
      } finally {
        this.loading = false
        this.showPrintDialog = false
      }
    }
  }
})