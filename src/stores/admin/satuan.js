import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'

export const useSatuanStore = defineStore('satuan', {
  state: () => ({
    satuans: [],
    loading: false,
    error: null,
    showSatuanForm: false,
    showDeleteConfirm: false,
    searchQuery: ''
  }),

  getters: {
    filteredSatuans: (state) => {
      return state.satuans.filter(satuan => {
        if (!state.searchQuery) return true

        const query = state.searchQuery.toLowerCase()
        return (
          satuan.name.toLowerCase().includes(query) ||
          satuan.description?.toLowerCase().includes(query)
        )
      })
    }
  },

  actions: {
    resetForm(satuan = null) {
      this.error = null
      this.loading = false
      this.formData = satuan ? { ...satuan } : {
        name: '',
        description: ''
      }
      this.showSatuanForm = false
    },

    async fetchSatuans() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/api/v1/satuans')
        // console.log('satuans', response.data);

        this.satuans = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch units'
        // console.error('Error fetching units:', error)
      } finally {
        this.loading = false
      }
    },

    async addSatuan(satuanData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/api/v1/satuans', satuanData)
        this.satuans.push(response.data)
        this.showSatuanForm = false
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add unit'
        // console.error('Error adding unit:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateSatuan(satuanData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.put(`/api/v1/satuans/${satuanData.id}`, satuanData)
        const index = this.satuans.findIndex(s => s.id === satuanData.id)
        if (index !== -1) {
          this.satuans[index] = response.data
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update unit'
        // console.error('Error updating unit:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteSatuan(satuanId) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/api/v1/satuans/${satuanId}`)
        const index = this.satuans.findIndex(s => s.id === satuanId)
        if (index !== -1) {
          this.satuans.splice(index, 1)
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete unit'
        // console.error('Error deleting unit:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    setShowSatuanForm(show) {
      this.showSatuanForm = show

    },

    setSearchQuery(query) {
      this.searchQuery = query
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSatuanStore, import.meta.hot))
}
