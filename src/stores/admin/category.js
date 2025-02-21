import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [
      {
        id: 1,
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        isActive: true
      },
      {
        id: 2,
        name: 'Clothing',
        description: 'Apparel and fashion items',
        isActive: true
      },
      {
        id: 3,
        name: 'Home Appliances',
        description: 'Household appliances and equipment',
        isActive: true
      },
      {
        id: 4,
        name: 'Footwear',
        description: 'Shoes and footwear items',
        isActive: true
      },
      {
        id: 5,
        name: 'Accessories',
        description: 'Various accessories and add-ons',
        isActive: true
      }
    ],
    showCategoryForm: false,
    showDeleteConfirm: false,
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      total: 0
    },
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
    addCategory(categoryData) {
      const newCategory = {
        id: this.categories.length + 1,
        ...categoryData
      }
      this.categories.push(newCategory)
      this.showCategoryForm = false
    },

    updateCategory(categoryData) {
      const index = this.categories.findIndex(c => c.id === categoryData.id)
      if (index !== -1) {
        this.categories[index] = { ...this.categories[index], ...categoryData }
      }
    },

    deleteCategory(categoryId) {
      const index = this.categories.findIndex(c => c.id === categoryId)
      if (index !== -1) {
        this.categories.splice(index, 1)
      }
    },

    setShowCategoryForm(show) {
      this.showCategoryForm = show
    },

    setPagination(pagination) {
      this.pagination = { ...this.pagination, ...pagination }
    },

    setSearchQuery(query) {
      this.searchQuery = query
    }
  }
})