import { acceptHMRUpdate, defineStore } from 'pinia'
import { useCategoryStore } from './category'
import { api } from '../../services/api'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    viewMode: 'grid',
    showProductForm: false,
    showDeleteConfirm: false,
    selectedProduct: null,
    isEdit: false,
    showScanner: false,
    showBatchOperations: false,
    showFilters: false,
    filters: {
      q: '',
      category: '',
      priceRange: {
        min: null,
        max: null
      },
      stockLevel: {
        min: null,
        max: null
      },
      status: 'all',
      category_id: null,
      sort_by: 'name',
      sort_dir: 'desc',
      per_page: 1,
      stock_op: '',
      stock_val: 0,
      hargajual_op: '',
      hargajual_val: 0,
      hargajualcust_op: '',
      hargajualcust_val: 0,
      hargajualantar_op: '',
      hargajualantar_val: 0
    },
    sortBy: {
      field: 'name',
      direction: 'asc'
    },
    pagination: {
      currentPage: 1,
      itemsPerPage: 12,
      total: 0,
      maxVisiblePages: 5
    },
    loading: false,
    error: null
  }),

  getters: {
    categories: () => {
      const storeCategories = useCategoryStore()
      return storeCategories.categories
    },

    filteredProducts: (state) => {
      // Server-side filtering is now handled by the API
      // This getter now only provides the current products state
      return state.products
    },

    // Add new getters for API parameters
    apiParams: (state) => {
      const params = {
        ...state.filters,
        page: state.pagination.currentPage
      }
      
      // Only include non-null filter values
      Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === '') {
          delete params[key]
        }
      })
      
      return params
    },
           

    paginatedProducts: (state, getters) => {
      const filteredProducts = getters?.filteredProducts || []
      const start = (state.pagination.currentPage - 1) * state.pagination.itemsPerPage
      const end = start + state.pagination.itemsPerPage
      return filteredProducts.slice(start, end)
    },

    paginationInfo: (state, getters) => {
      const totalItems = state.pagination?.total
      const totalPages = Math.ceil(totalItems / state.pagination.itemsPerPage)

      let startPage = Math.max(1, state.pagination.currentPage - Math.floor(state.pagination.maxVisiblePages / 2))
      let endPage = Math.min(totalPages, startPage + state.pagination.maxVisiblePages - 1)

      if (endPage - startPage + 1 < state.pagination.maxVisiblePages) {
        startPage = Math.max(1, endPage - state.pagination.maxVisiblePages + 1)
      }

      return {
        currentPage: state.pagination?.currentPage,
        totalPages,
        itemsPerPage: state.pagination?.itemsPerPage,
        startPage,
        endPage,
        totalItems,
        maxVisiblePages: state.pagination?.maxVisiblePages
      }
    }
  },

  actions: {
    setViewMode(mode) {
      this.viewMode = mode
    },

    setFilter(name,value) {
      this.filters[name] = value
      this.setCurrentPage(1)
      this.fetchProducts()
    },

    setShowProductForm(value) {
      this.showProductForm = value
      if (!value) {
        this.selectedProduct = null
        this.isEdit = false
      }
    },

    setSearchQuery(query) {
      this.filters.q = query
      this.setCurrentPage(1)
    },

    setShowFilters(value) {
      this.showFilters = value
    },

    resetFilters() {
      this.filters = {
        ...this.filters,
        sort_by: this.sortBy.field,
        per_page: this.pagination?.itemsPerPage,
        category_id: null,
        priceRange: {
          min: null,
          max: null
        },
        stockLevel: {
          min: null,
          max: null
        },
        status: 'all'
      },

      this.pagination.currentPage = 1
      this.fetchProducts()
    },

    setCurrentPage(page) {
      this.pagination.currentPage = page
    },

    handleEditProduct(product) {
      this.selectedProduct = { ...product }
      this.showProductForm = true
      this.isEdit = true
    },

    showDeleteConfirmation(product) {
      this.selectedProduct = { ...product }
      this.showDeleteConfirm = true
    },

    handleProductSubmit(productData) {
      if (this.isEdit) {
        this.updateProduct({ ...productData, id: this.selectedProduct.id })
      } else {
        this.addProduct(productData)
      }
      this.showProductForm = false
      this.selectedProduct = null
      this.isEdit = false
    },

    handleProductCancel() {
      this.showProductForm = false
      this.selectedProduct = null
      this.isEdit = false
    },

    handlePage(page) {
      this.pagination.currentPage = page
      this.fetchProducts()
    },
    

    async fetchProducts() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/api/v1/products/search', {
          params: {
            page: this.pagination.currentPage,
            per_page: this.pagination.itemsPerPage,
            sort_by: this.sortBy.field,
            sort_direction: this.sortBy.direction,
            ...this.filters
          }
        })

        console.log('fetch products', response.data);
        
        this.products = response.data?.data
        this.pagination = {
          currentPage: response.data?.meta?.current_page,
          total: response.data?.meta?.total,
          itemsPerPage: this.pagination.itemsPerPage,
          maxVisiblePages: this.pagination.maxVisiblePages
        } 
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch products'
        console.error('Error fetching products:', error)
      } finally {
        this.loading = false
      }
    },

    async addProduct(productData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/api/products', productData)
        const newProduct = {
          ...response.data,
          currentStock: response.data.initial_stock
        }
        this.products.push(newProduct)
        this.showProductForm = false
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add product'
        console.error('Error adding product:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProduct(productData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.put(`/api/products/${productData.id}`, productData)
        const index = this.products.findIndex(p => p.id === productData.id)
        if (index !== -1) {
          this.products[index] = response.data
        }
        this.showProductForm = false
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update product'
        console.error('Error updating product:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteProduct(productId) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/api/products/${productId}`)
        this.products = this.products.filter(p => p.id !== productId)
        this.showDeleteConfirm = false
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete product'
        console.error('Error deleting product:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot))
}