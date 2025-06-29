import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'

export const useUsersStore = defineStore('users', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    showForm: false,
    showDeleteConfirm: false,
    searchQuery: '',
    role: 'kasir',

  }),

  getters: {

  },

  actions: {
    async fetchData() {
      this.loading = true
      this.error = null

      const params = {
        params: {
          q: this.searchQuery,
          role: this.role
        }
      }

      try {
        const response = await api.get('/api/v1/users', params)
        this.items = response.data
        console.log('users', response.data);

      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch users'
        console.error('Error fetching users:', error)
      } finally {
        this.loading = false
      }
    },

    // async addCategory(categoryData) {
    //   this.loading = true
    //   this.error = null
    //   try {
    //     const response = await api.post('/api/v1/categories', categoryData)
    //     this.categories.push(response.data)
    //     this.showCategoryForm = false
    //   } catch (error) {
    //     this.error = error.response?.data?.message || 'Failed to add category'
    //     console.error('Error adding category:', error)
    //     throw error
    //   } finally {
    //     this.loading = false
    //   }
    // },

    // async updateCategory(categoryData) {
    //   this.loading = true
    //   this.error = null
    //   try {
    //     const response = await api.put(`/api/v1/categories/${categoryData.id}`, categoryData)
    //     const index = this.categories.findIndex(c => c.id === categoryData.id)
    //     if (index !== -1) {
    //       this.categories[index] = response.data
    //     }
    //   } catch (error) {
    //     this.error = error.response?.data?.message || 'Failed to update category'
    //     console.error('Error updating category:', error)
    //     throw error
    //   } finally {
    //     this.loading = false
    //   }
    // },

    // async deleteCategory(categoryId) {
    //   this.loading = true
    //   this.error = null
    //   try {
    //     await api.delete(`/api/v1/categories/${categoryId}`)
    //     const index = this.categories.findIndex(c => c.id === categoryId)
    //     if (index !== -1) {
    //       this.categories.splice(index, 1)
    //     }
    //   } catch (error) {
    //     this.error = error.response?.data?.message || 'Failed to delete category'
    //     console.error('Error deleting category:', error)
    //     throw error
    //   } finally {
    //     this.loading = false
    //   }
    // },

    setShowForm(show) {
      this.showForm = show
    },

    setSearchQuery(query) {
      this.searchQuery = query
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot))
}
