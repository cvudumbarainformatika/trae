import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const usePurchaseFormStore = defineStore('purchaseForm', {
  state: () => ({
    form: {
      supplier_id: null,
      supplier: null,
      date: new Date().toISOString().split('T')[0],
      invoice_number: '',
      purchase_order_id: null,
      items: [],
      discount: 0,
      tax: 0,
      notes: '',
      status: 'pending'
    },
    loading: false,
    error: null,
    success: false,
    purchaseOrderData: null,
    showScanner: false,
    supplierSearch: '',
    productSearch: '',
    showSupplierResults: false,
    showProductResults: false,
    filteredSuppliers: [],
    filteredProducts: [],
    supplierLoading: false,
    productLoading: false,
    fromPage: null
  }),

  getters: {
    isFormValid: (state) => {
      return state.form.supplier_id && state.form.items.length > 0
    },

    totalAmount: (state) => {
      return state.form.items.reduce((sum, item) => sum + (item.subtotal || 0), 0)
    },

    totalQuantity: (state) => {
      return state.form.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
    },

    grandTotal: (state) => {
      const subtotal = state.form.items.reduce((total, item) => total + (item.subtotal || 0), 0)
      const discountAmount = state.form.discount || 0
      const taxAmount = subtotal * (state.form.tax / 100) || 0

      return subtotal - discountAmount + taxAmount
    }
  },

  actions: {
    resetForm() {
      this.form = {
        supplier_id: null,
        supplier: null,
        date: new Date().toISOString().split('T')[0],
        invoice_number: '',
        purchase_order_id: null,
        items: [],
        discount: 0,
        tax: 0,
        notes: '',
        status: 'pending'
      }
      this.error = null
      this.success = false
    },

    calculateTotal() {
      return this.form.items.reduce((total, item) => total + (item.subtotal || 0), 0)
    },

    calculateTotalQuantity() {
      return this.form.items.reduce((total, item) => total + (item.quantity || 0), 0)
    },

    calculateGrandTotal() {
      const subtotal = this.calculateTotal()
      const discountAmount = this.form.discount || 0
      const taxAmount = subtotal * (this.form.tax / 100) || 0

      return subtotal - discountAmount + taxAmount
    },

    updateSubtotal(item) {
      if (!item) return
      item.subtotal = (item.price || 0) * (item.quantity || 0)
    },

    selectSupplier(supplier) {
      this.form.supplier_id = supplier.id
      this.form.supplier = supplier
      this.showSupplierResults = false
    },

    addProductToOrder(product) {
      // Check if product already exists in items
      const existingItemIndex = this.form.items.findIndex(item => item.product_id === product.id)

      if (existingItemIndex !== -1) {
        // Increment quantity if product already exists
        this.form.items[existingItemIndex].quantity += 1
        this.updateSubtotal(this.form.items[existingItemIndex])
      } else {
        // Add new item if product doesn't exist
        const newItem = {
          product_id: product.id,
          product: product,
          price: product.purchase_price || 0,
          quantity: 1,
          subtotal: product.purchase_price || 0
        }

        this.form.items.push(newItem)
      }

      // Clear search
      this.productSearch = ''
      this.showProductResults = false
    },

    removeItem(index) {
      this.form.items.splice(index, 1)
    },

    async submitForm() {
      if (!this.isFormValid) {
        this.error = 'Silakan lengkapi form terlebih dahulu'
        return
      }

      this.loading = true

      try {
        // Prepare data for API
        const formData = {
          supplier_id: this.form.supplier_id,
          date: this.form.date,
          invoice_number: this.form.invoice_number,
          purchase_order_id: this.form.purchase_order_id,
          items: this.form.items.map(item => ({
            product_id: item.product_id,
            price: item.price,
            quantity: item.quantity
          })),
          discount: this.form.discount,
          tax: this.form.tax,
          notes: this.form.notes,
          status: this.form.status
        }

        // Send data to API
        const { data } = await api.post('/api/v1/purchases', formData)
        this.success = true
        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.'
        console.error('Error submitting form:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPurchaseOrderById(id) {
      if (!id) return

      this.loading = true

      try {
        const { data } = await api.get(`/api/v1/purchase-orders/${id}`)
        this.purchaseOrderData = data

        // Set supplier from purchase order
        this.form.supplier_id = data.supplier_id
        this.form.supplier = data.supplier

        // Set items from purchase order
        this.form.items = data.items.map(item => ({
          product_id: item.product_id,
          product: item.product,
          price: item.price,
          quantity: item.received_quantity || item.quantity,
          subtotal: (item.price * (item.received_quantity || item.quantity))
        }))

        return data
      } catch (error) {
        this.error = error.response?.data?.message || 'Terjadi kesalahan saat memuat data purchase order. Silakan coba lagi.'
        console.error('Error fetching purchase order:', error)
      } finally {
        this.loading = false
      }
    },

    // Barcode scanner
    openBarcodeScanner() {
      this.showScanner = true
    },

    closeBarcodeScanner() {
      this.showScanner = false
    },

    async handleBarcodeScan(barcode) {
      this.showScanner = false
      this.productSearch = barcode

      // Fetch product by barcode
      try {
        const { data } = await api.get('/api/v1/products', {
          params: { barcode }
        })

        if (data.data && data.data.length > 0) {
          this.addProductToOrder(data.data[0])
        } else {
          this.error = `Produk dengan barcode ${barcode} tidak ditemukan`
        }
      } catch (error) {
        console.error('Error fetching product by barcode:', error)
        this.error = 'Terjadi kesalahan saat mencari produk'
      }
    },

    // Event handlers
    onSuppliersLoaded(suppliers) {
      this.filteredSuppliers = suppliers
    },

    onProductsLoaded(products) {
      this.filteredProducts = products
    },

    // Navigation
    goBack(router) {
      // Jika ada parameter from, gunakan itu untuk navigasi kembali
      if (this.fromPage === 'po-detail' && this.form.purchase_order_id) {
        router.push(`/admin/transaksi/po`)
      }
      else if (this.fromPage === 'po-list') {
        router.push('/admin/transaksi/po')
      }
      // Default kembali ke daftar pembelian
      else {
        router.push('/admin/transaksi/pembelian')
      }
    },

    // Set from page
    setFromPage(from) {
      this.fromPage = from
    },

    // Set purchase order ID
    setPurchaseOrderId(id) {
      this.form.purchase_order_id = id
      if (id) {
        this.fetchPurchaseOrderById(id)
      }
    }
  }
})
