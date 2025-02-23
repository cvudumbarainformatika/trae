import { acceptHMRUpdate, defineStore } from 'pinia'
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
      sort_dir: 'asc',
      per_page: 12,
      stock_op: null,
      stock_val: null,
      hargajual_op: null,
      hargajual_val: null,
      hargajualcust_op: null,
      hargajualcust_val: null,
      hargajualantar_op: null,
      hargajualantar_val: null
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
    categories: (state) => {
      const uniqueCategories = new Set(state.products.map(p => p.category))
      return Array.from(uniqueCategories).sort()
    },

    filteredProducts: (state) => {
      return state.products.filter(product => {
        // Search query filter
        if (state.filters?.q) {
          const query = state.filters.q.toLowerCase()
          if (!(
            product?.name?.toLowerCase()?.includes(query) ||
            product?.barcode?.toLowerCase()?.includes(query) ||
            product?.category?.toLowerCase()?.includes(query)
          )) {
            return false
          }
        }

        // Category filter
        if (state.filters?.category && product?.category !== state.filters.category) {
          return false
        }

        // Price range filter
        if (state.filters?.priceRange?.min && product?.regularPrice < state.filters.priceRange.min) {
          return false
        }
        if (state.filters?.priceRange?.max && product?.regularPrice > state.filters.priceRange.max) {
          return false
        }

        // Stock level filter
        if (state.filters?.stockLevel?.min && product?.currentStock < state.filters.stockLevel.min) {
          return false
        }
        if (state.filters?.stockLevel?.max && product?.currentStock > state.filters.stockLevel.max) {
          return false
        }

        // Status filter
        if (state.filters?.status !== 'all') {
          switch (state.filters.status) {
            case 'in-stock':
              if (product?.currentStock <= product?.minStock) return false
              break
            case 'low-stock':
              if (product?.currentStock > product?.minStock || product?.currentStock === 0) return false
              break
            case 'out-of-stock':
              if (product?.currentStock !== 0) return false
              break
          }
        }

        return true
      })
    },

    paginatedProducts: (state, getters) => {
      const filteredProducts = getters?.filteredProducts || []
      const start = (state.pagination.currentPage - 1) * state.pagination.itemsPerPage
      const end = start + state.pagination.itemsPerPage
      return filteredProducts.slice(start, end)
    },

    paginationInfo: (state, getters) => {
      const totalItems = getters?.filteredProducts?.length
      const totalPages = Math.ceil(totalItems / state.pagination.itemsPerPage)

      let startPage = Math.max(1, state.pagination.currentPage - Math.floor(state.pagination.maxVisiblePages / 2))
      let endPage = Math.min(totalPages, startPage + state.pagination.maxVisiblePages - 1)

      if (endPage - startPage + 1 < state.pagination.maxVisiblePages) {
        startPage = Math.max(1, endPage - state.pagination.maxVisiblePages + 1)
      }

      return {
        currentPage: state.pagination.currentPage,
        totalPages,
        itemsPerPage: state.pagination.itemsPerPage,
        startPage,
        endPage,
        totalItems
      }
    }
  },

  actions: {
    setViewMode(mode) {
      this.viewMode = mode
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
      this.pagination.currentPage = 1
    },

    setShowFilters(value) {
      this.showFilters = value
    },

    resetFilters() {
      this.filters = {
        ...this.filters,
        category: '',
        priceRange: {
          min: null,
          max: null
        },
        stockLevel: {
          min: null,
          max: null
        },
        status: 'all'
      }
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
        
        this.products = response.data.data
        this.pagination.total = response.data.total
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