import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    loading: false,
    error: null,
    showCategoryForm: false,
    showDeleteConfirm: false,
    searchQuery: ''
  }),

  getters: {
    filteredCategories: (state) => {
      return state.categories.filter(category => {
        if (!state.searchQuery) return true

        const query = state.searchQuery.toLowerCase()
        return (
          category.name.toLowerCase().includes(query) ||
          category.description.toLowerCase().includes(query)
        )
      })
    }
  },

  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/api/v1/categories')
        this.categories = response.data
        // console.log('categories', response.data);

      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch categories'
        console.error('Error fetching categories:', error)
      } finally {
        this.loading = false
      }
    },

    async addCategory(categoryData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/api/v1/categories', categoryData)
        this.categories.push(response.data)
        this.showCategoryForm = false
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add category'
        console.error('Error adding category:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCategory(categoryData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.put(`/api/v1/categories/${categoryData.id}`, categoryData)
        const index = this.categories.findIndex(c => c.id === categoryData.id)
        if (index !== -1) {
          this.categories[index] = response.data
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update category'
        console.error('Error updating category:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCategory(categoryId) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/api/v1/categories/${categoryId}`)
        const index = this.categories.findIndex(c => c.id === categoryId)
        if (index !== -1) {
          this.categories.splice(index, 1)
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete category'
        console.error('Error deleting category:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    setShowCategoryForm(show) {
      this.showCategoryForm = show
    },

    setSearchQuery(query) {
      this.searchQuery = query
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoryStore, import.meta.hot))
}
