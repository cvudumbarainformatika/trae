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
      status: 'pending',
      payment_method: 'cash', // Default payment method
      due_date: null,         // Untuk pembayaran kredit
      bank_name: '',          // Untuk pembayaran transfer
      account_number: '',     // Untuk pembayaran transfer
      account_name: ''        // Untuk pembayaran transfer
    },
    loading: false,
    error: null,
    success: false,
    filteredSuppliers: [],
    filteredProducts: [],
    supplierSearch: '',
    productSearch: '',
    supplierLoading: false,
    productLoading: false,
    purchaseOrderData: null,
    fromPage: null,
    showScanner: false, // Tambahkan state untuk scanner
    isDirty: false,
    validationErrors: [],
    showUnsavedChangesDialog: false,
    redirectPath: null
  }),

  getters: {
    // Getter untuk validasi
    isFormValid: (state) => {
      return state.form.supplier_id &&
             state.form.items.length > 0 &&
             state.form.invoice_number &&
             state.form.invoice_number.trim() !== ''
    },
  },

  actions: {
    // Method untuk mencari supplier
    async searchSuppliers(query) {
      if (!query || query.length < 2) {
        this.filteredSuppliers = []
        return
      }

      this.supplierLoading = true

      try {
        const { data } = await api.get('/api/v1/suppliers/search', {
          params: { query }
        })

        this.filteredSuppliers = data || []
      } catch (error) {
        console.error('Error searching suppliers:', error)
        this.filteredSuppliers = []
      } finally {
        this.supplierLoading = false
      }
    },

    // Method untuk menambahkan produk
    addProduct(product) {
      if (!product || !product.id) return;

      const newItem = {
        product_id: product.id,
        product: product,
        quantity: 1,
        price: product.hargabeli || 0,
        subtotal: product.hargabeli || 0,
        is_additional: this.form.purchase_order_id ? true : false // Tandai sebagai item tambahan jika dari PO
      };

      // Cek apakah produk sudah ada di daftar
      const existingIndex = this.form.items.findIndex(item => item.product_id === product.id);

      if (existingIndex >= 0) {
        // Update quantity jika sudah ada
        this.form.items[existingIndex].quantity += 1;
        this.updateItemSubtotal(existingIndex);
      } else {
        // Tambahkan item baru
        this.form.items.push(newItem);
      }

      this.isDirty = true;
    },

    // Method untuk menghapus item
    removeItem(index) {
      if (index < 0 || index >= this.form.items.length) return;

      const item = this.form.items[index];

      // Jika dari PO dan bukan item tambahan, cegah penghapusan
      if (this.form.purchase_order_id && !item.is_additional) {
        console.warn('Tidak dapat menghapus item yang berasal dari PO');
        return;
      }

      this.form.items.splice(index, 1);
      this.isDirty = true;
    },

    // Method yang sudah ada
    resetForm() {
      // ...
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

    // Validate form
    validateForm() {
      const errors = []

      if (!this.form.supplier_id) {
        errors.push('Supplier harus dipilih')
      }

      if (this.form.items.length === 0) {
        errors.push('Minimal satu produk harus ditambahkan')
      }

      if (!this.form.invoice_number || this.form.invoice_number.trim() === '') {
        errors.push('Nomor faktur harus diisi')
      }

      // Validasi lainnya jika diperlukan

      return errors
    },

    // Handle navigation away with unsaved changes
    handleBeforeUnload(router) {
      // Add beforeEach guard to router
      router.beforeEach((to, from, next) => {
        // If form is dirty and not navigating to the same route
        if (this.isDirty && to.path !== from.path) {
          // Store the intended path
          this.redirectPath = to.fullPath
          // Show confirmation dialog
          this.showUnsavedChangesDialog = true
          // Prevent navigation
          next(false)
        } else {
          // Allow navigation
          next()
        }
      })

      // Add beforeunload event listener
      window.addEventListener('beforeunload', (e) => {
        if (this.isDirty) {
          // Standard way to show browser confirmation dialog
          e.preventDefault()
          e.returnValue = ''
        }
      })
    },

    // Confirm leave page with unsaved changes
    confirmLeave(router) {
      this.isDirty = false
      this.showUnsavedChangesDialog = false

      if (this.redirectPath) {
        router.push(this.redirectPath)
        this.redirectPath = null
      }
    },

    // Generate invoice PDF
    async generateInvoice() {
      try {
        const response = await api.get(`/api/v1/purchases/${this.form.id}/invoice`, {
          responseType: 'blob'
        })

        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `invoice-${this.form.invoice_number || this.form.id}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      } catch (error) {
        console.error('Error generating invoice:', error)
        throw error
      }
    },

    // Submit form
    async submitForm() {
      // Validate form
      const validationErrors = this.validateForm()

      if (validationErrors.length > 0) {
        this.validationErrors = validationErrors
        throw new Error('Silakan perbaiki kesalahan pada form')
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
            quantity: item.quantity,
            price: item.price
          })),
          discount: this.form.discount,
          tax: this.form.tax,
          notes: this.form.notes,
          status: this.form.status,
          payment_method: this.form.payment_method,
          due_date: this.form.payment_method === 'credit' ? this.form.due_date : null
        }

        // Tambahkan data bank jika metode pembayaran adalah transfer
        if (this.form.payment_method === 'transfer') {
          formData.bank_name = this.form.bank_name
          formData.account_number = this.form.account_number
          formData.account_name = this.form.account_name
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

    // Fetch purchase by ID
    async fetchPurchase(id) {
      this.loading = true

      try {
        const { data } = await api.get(`/api/v1/purchases/${id}`)

        // Set form data from API response
        this.form = {
          id: data.id,
          supplier_id: data.supplier_id,
          supplier: data.supplier,
          date: data.date,
          invoice_number: data.invoice_number,
          purchase_order_id: data.purchase_order_id,
          items: data.items.map(item => ({
            product_id: item.product_id,
            product: item.product,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
          })),
          discount: data.discount || 0,
          tax: data.tax || 0,
          notes: data.notes || '',
          payment_method: data.payment_method || 'cash',
          due_date: data.due_date || null,
          bank_name: data.bank_name || '',
          account_number: data.account_number || '',
          account_name: data.account_name || '',
          status: data.status || 'pending'
        }

        return data
      } catch (error) {
        console.error('Error fetching purchase:', error)
        throw error
      } finally {
        this.loading = false
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
    },

    // Fetch purchase order by ID
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

    // Method untuk memuat data dari PO
    async loadFromPurchaseOrder(poId) {
      try {
        this.loading = true;
        const response = await api.get(`/api/v1/purchase-orders/${poId}`);
        const po = response.data;

        // Set data supplier dan PO
        this.form.purchase_order_id = po.id;
        this.form.supplier_id = po.supplier_id;
        this.form.supplier = po.supplier;

        // Set items dari PO dengan flag is_additional = false
        this.form.items = po.items.map(item => ({
          product_id: item.product_id,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
          is_additional: false // Tandai sebagai item dari PO
        }));

        this.isDirty = false;
        return true;
      } catch (error) {
        console.error('Error loading PO data:', error);
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
})
