import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [
      {
        id: 1,
        barcode: '890123456789',
        name: 'Smartphone X1',
        unit: 'pcs',
        category: 'Electronics',
        buyPrice: 2500000,
        regularPrice: 3000000,
        customerPrice: 2900000,
        wholesalePrice: 2800000,
        initialStock: 50,
        currentStock: 35,
        minStock: 10,
        rack: 'A-1',
        image: ''
      },
      {
        id: 2,
        barcode: '890123456790',
        name: 'Cotton T-Shirt',
        unit: 'pcs',
        category: 'Clothing',
        buyPrice: 50000,
        regularPrice: 89000,
        customerPrice: 85000,
        wholesalePrice: 75000,
        initialStock: 200,
        currentStock: 150,
        minStock: 30,
        rack: 'B-1',
        image: null
      },
      {
        id: 3,
        barcode: '890123456791',
        name: 'Coffee Maker Pro',
        unit: 'pcs',
        category: 'Home Appliances',
        buyPrice: 450000,
        regularPrice: 599000,
        customerPrice: 579000,
        wholesalePrice: 520000,
        initialStock: 30,
        currentStock: 22,
        minStock: 5,
        rack: 'C-1',
        image: null
      },
      {
        id: 4,
        barcode: '890123456792',
        name: 'Gaming Mouse',
        unit: 'pcs',
        category: 'Electronics',
        buyPrice: 200000,
        regularPrice: 299000,
        customerPrice: 289000,
        wholesalePrice: 250000,
        initialStock: 100,
        currentStock: 88,
        minStock: 15,
        rack: 'A-2',
        image: null
      },
      {
        id: 5,
        barcode: '890123456793',
        name: 'Denim Jeans',
        unit: 'pcs',
        category: 'Clothing',
        buyPrice: 150000,
        regularPrice: 249000,
        customerPrice: 239000,
        wholesalePrice: 200000,
        initialStock: 150,
        currentStock: 127,
        minStock: 20,
        rack: 'B-2',
        image: null
      },
      {
        id: 6,
        barcode: '890123456794',
        name: 'Blender Plus',
        unit: 'pcs',
        category: 'Home Appliances',
        buyPrice: 300000,
        regularPrice: 449000,
        customerPrice: 429000,
        wholesalePrice: 380000,
        initialStock: 40,
        currentStock: 28,
        minStock: 8,
        rack: 'C-2',
        image: null
      },
      {
        id: 7,
        barcode: '890123456795',
        name: 'Wireless Earbuds',
        unit: 'pcs',
        category: 'Electronics',
        buyPrice: 400000,
        regularPrice: 599000,
        customerPrice: 579000,
        wholesalePrice: 500000,
        initialStock: 80,
        currentStock: 65,
        minStock: 12,
        rack: 'A-3',
        image: null
      },
      {
        id: 8,
        barcode: '890123456796',
        name: 'Sports Shoes',
        unit: 'pair',
        category: 'Footwear',
        buyPrice: 250000,
        regularPrice: 399000,
        customerPrice: 379000,
        wholesalePrice: 320000,
        initialStock: 100,
        currentStock: 82,
        minStock: 15,
        rack: 'D-1',
        image: null
      },
      {
        id: 9,
        barcode: '890123456797',
        name: 'Rice Cooker',
        unit: 'pcs',
        category: 'Home Appliances',
        buyPrice: 180000,
        regularPrice: 279000,
        customerPrice: 259000,
        wholesalePrice: 230000,
        initialStock: 60,
        currentStock: 45,
        minStock: 10,
        rack: 'C-3',
        image: null
      },
      {
        id: 10,
        barcode: '890123456798',
        name: 'Laptop Bag',
        unit: 'pcs',
        category: 'Accessories',
        buyPrice: 120000,
        regularPrice: 199000,
        customerPrice: 189000,
        wholesalePrice: 160000,
        initialStock: 120,
        currentStock: 98,
        minStock: 20,
        rack: 'E-1',
        image: null
      },
      {
        id: 11,
        barcode: '890123456799',
        name: 'Smart Watch',
        unit: 'pcs',
        category: 'Electronics',
        buyPrice: 800000,
        regularPrice: 1199000,
        customerPrice: 1149000,
        wholesalePrice: 1000000,
        initialStock: 40,
        currentStock: 28,
        minStock: 8,
        rack: 'A-4',
        image: null
      },
      {
        id: 12,
        barcode: '890123456800',
        name: 'Winter Jacket',
        unit: 'pcs',
        category: 'Clothing',
        buyPrice: 350000,
        regularPrice: 499000,
        customerPrice: 479000,
        wholesalePrice: 420000,
        initialStock: 80,
        currentStock: 65,
        minStock: 15,
        rack: 'B-3',
        image: null
      },
      {
        id: 13,
        barcode: '890123456801',
        name: 'Air Purifier',
        unit: 'pcs',
        category: 'Home Appliances',
        buyPrice: 900000,
        regularPrice: 1299000,
        customerPrice: 1249000,
        wholesalePrice: 1100000,
        initialStock: 25,
        currentStock: 18,
        minStock: 5,
        rack: 'C-4',
        image: null
      },
      {
        id: 14,
        barcode: '890123456802',
        name: 'Backpack',
        unit: 'pcs',
        category: 'Accessories',
        buyPrice: 180000,
        regularPrice: 279000,
        customerPrice: 259000,
        wholesalePrice: 220000,
        initialStock: 100,
        currentStock: 85,
        minStock: 20,
        rack: 'E-2',
        image: '/placeholder.jpg'
      },
      {
        id: 15,
        barcode: '890123456803',
        name: 'Mechanical Keyboard',
        unit: 'pcs',
        category: 'Electronics',
        buyPrice: 450000,
        regularPrice: 649000,
        customerPrice: 629000,
        wholesalePrice: 550000,
        initialStock: 50,
        currentStock: 38,
        minStock: 10,
        rack: 'A-5',
        image: null
      },
      {
        id: 16,
        barcode: '890123456804',
        name: 'Casual Shoes',
        unit: 'pair',
        category: 'Footwear',
        buyPrice: 200000,
        regularPrice: 329000,
        customerPrice: 309000,
        wholesalePrice: 270000,
        initialStock: 120,
        currentStock: 95,
        minStock: 20,
        rack: 'D-2',
        image: null
      },
      {
        id: 17,
        barcode: '890123456805',
        name: 'Electric Fan',
        unit: 'pcs',
        category: 'Home Appliances',
        buyPrice: 150000,
        regularPrice: 229000,
        customerPrice: 219000,
        wholesalePrice: 190000,
        initialStock: 80,
        currentStock: 62,
        minStock: 15,
        rack: 'C-5',
        image: null
      },
      {
        id: 18,
        barcode: '890123456806',
        name: 'Dress Shirt',
        unit: 'pcs',
        category: 'Clothing',
        buyPrice: 120000,
        regularPrice: 199000,
        customerPrice: 189000,
        wholesalePrice: 160000,
        initialStock: 150,
        currentStock: 128,
        minStock: 25,
        rack: 'B-4',
        image: '/placeholder.jpg'
      },
      {
        id: 19,
        barcode: '890123456807',
        name: 'Wireless Charger',
        unit: 'pcs',
        category: 'Electronics',
        buyPrice: 100000,
        regularPrice: 179000,
        customerPrice: 169000,
        wholesalePrice: 140000,
        initialStock: 100,
        currentStock: 78,
        minStock: 20,
        rack: 'A-6',
        image: null
      },
      {
        id: 20,
        barcode: '890123456808',
        name: 'Water Bottle',
        unit: 'pcs',
        category: 'Accessories',
        buyPrice: 40000,
        regularPrice: 79000,
        customerPrice: 69000,
        wholesalePrice: 55000,
        initialStock: 200,
        currentStock: 165,
        minStock: 30,
        rack: 'E-3',
        image: null
      }
    ],
    viewMode: 'grid',
    showProductForm: false,
    showDeleteConfirm: false,
    filters: {
      category: '',
      minStock: null,
      maxStock: null,
      minPrice: null,
      maxPrice: null,
      unit: ''
    },
    sortBy: {
      field: 'name',
      direction: 'asc'
    },
    pagination: {
      currentPage: 1,
      itemsPerPage: 12,
      total: 0
    },
    searchQuery: ''
  }),

  getters: {
    filteredProducts: (state) => {
      return state.products.filter(product => {
        if (!state.searchQuery) return true
        
        const query = state.searchQuery.toLowerCase()
        return (
          product.name.toLowerCase().includes(query) ||
          product.barcode.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        )
      })
    }
  },

  actions: {
    addProduct(productData) {
      const newProduct = {
        id: this.products.length + 1,
        ...productData,
        currentStock: productData.initialStock
      }
      this.products.push(newProduct)
      this.showProductForm = false
    },

    updateProduct(productData) {
      const index = this.products.findIndex(p => p.id === productData.id)
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...productData }
      }
    },

    deleteProduct(productId) {
      const index = this.products.findIndex(p => p.id === productId)
      if (index !== -1) {
        this.products.splice(index, 1)
      }
    },

    setViewMode(mode) {
      this.viewMode = mode
    },

    setShowProductForm(show) {
      this.showProductForm = show
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    setSortBy(field, direction) {
      this.sortBy = { field, direction }
    },

    setPagination(pagination) {
      this.pagination = { ...this.pagination, ...pagination }
    },

    setSearchQuery(query) {
      this.searchQuery = query
    }
  }
})