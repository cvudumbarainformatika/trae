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
      payment_method: '',
      due_date: null,
      bank_name: '',
      account_number: '',
      account_name: '',
      paid: 0  // Jumlah yang sudah dibayarkan (bukan status 0/1)
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
             state.form.invoice_number.trim() !== '' &&
             state.form.payment_method !== ''
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

    // Method untuk memperbarui subtotal item
    updateItemSubtotal(index) {
      const item = this.form.items[index];
      item.subtotal = item.price * item.quantity;
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
      // Hanya pertahankan purchase_order_id jika fromPage adalah 'po-detail' atau 'po-list'
      const shouldKeepPurchaseOrderId = this.fromPage === 'po-detail' || this.fromPage === 'po-list'
      const oldPurchaseOrderId = shouldKeepPurchaseOrderId ? this.form.purchase_order_id : null

      this.form = {
        supplier_id: null,
        supplier: null,
        date: new Date().toISOString().split('T')[0],
        invoice_number: '',
        purchase_order_id: oldPurchaseOrderId,
        items: [],
        discount: 0,
        tax: 0,
        notes: '',
        status: 'pending',
        payment_method: '',
        due_date: null,
        bank_name: '',
        account_number: '',
        account_name: '',
        paid: 0  // Jumlah yang sudah dibayarkan
      }

      this.loading = false
      this.error = null
      this.success = false
      this.filteredSuppliers = []
      this.filteredProducts = []
      this.supplierSearch = ''
      this.productSearch = ''
      this.supplierLoading = false
      this.productLoading = false
      this.isDirty = false
      this.validationErrors = []

      if (shouldKeepPurchaseOrderId) {
        console.log('Form reset, purchase_order_id preserved:', this.form.purchase_order_id)
      } else {
        console.log('Form reset, purchase_order_id cleared')
      }
    },

    calculateTotal() {
      // console.log('Calculating total...', this.form.items);

      return this.form.items.reduce((total, item) => {
        const price = parseFloat(item.price || 0)
        const quantity = parseFloat(item.quantity || 0)
        return total + (price * quantity)
      }, 0)
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

      // Validasi metode pembayaran
      if (!this.form.payment_method) {
        errors.push('Metode pembayaran harus dipilih')
      }

      // Validasi tambahan untuk metode pembayaran kredit
      if (this.form.payment_method === 'credit' && !this.form.due_date) {
        errors.push('Tanggal jatuh tempo harus diisi untuk pembayaran kredit')
      }

      // Validasi tambahan untuk metode pembayaran transfer
      if (this.form.payment_method === 'transfer') {
        if (!this.form.bank_name) {
          errors.push('Nama bank harus diisi untuk pembayaran transfer')
        }
        if (!this.form.account_number) {
          errors.push('Nomor rekening harus diisi untuk pembayaran transfer')
        }
        if (!this.form.account_name) {
          errors.push('Nama pemilik rekening harus diisi untuk pembayaran transfer')
        }
      }

      // // Validasi format data
      // if (typeof this.form.paid !== 'number') {
      //   console.warn('Field paid bukan number, mengkonversi dari', typeof this.form.paid, 'ke number')
      //   this.form.paid = this.form.paid ? 1 : 0
      // }

      // if (typeof this.form.discount !== 'number') {
      //   console.warn('Field discount bukan number, mengkonversi dari', typeof this.form.discount)
      //   this.form.discount = Number(this.form.discount) || 0
      // }

      // if (typeof this.form.tax !== 'number') {
      //   console.warn('Field tax bukan number, mengkonversi dari', typeof this.form.tax)
      //   this.form.tax = Number(this.form.tax) || 0
      // }

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

      // Ensure correct data types
      this.ensureCorrectDataTypes()

      this.loading = true

      try {
        // Prepare data for API

        const totalYgHrsDibayar = this.calculateGrandTotal();

        const formData = {
          supplier_id: this.form.supplier_id,
          date: this.form.date,
          invoice_number: this.form.invoice_number,
          items: this.form.items.map(item => {
            const itemData = {
              product_id: item.product_id,
              qty: item.quantity, // Ubah dari quantity menjadi qty sesuai ekspektasi backend
              price: item.price
            }

            // Tambahkan purchase_order_item_id jika ada dan item bukan tambahan
            if (this.form.purchase_order_id && item.purchase_order_item_id && !item.is_additional) {
              itemData.purchase_order_item_id = item.purchase_order_item_id
            }

            return itemData
          }),
          discount: this.form.discount,
          tax: this.form.tax,
          notes: this.form.notes,
          status: this.form.status,
          payment_method: this.form.payment_method,
          due_date: this.form.payment_method === 'credit' ? this.form.due_date : null,
          // Untuk cash/transfer, paid = total invoice. Untuk credit, paid = 0
          paid: (this.form.payment_method === 'cash' || this.form.payment_method === 'transfer')
            ? totalYgHrsDibayar
            : this.form.paid

        }

        // Hanya tambahkan purchase_order_id jika ada nilainya
        if (this.form.purchase_order_id) {
          formData.purchase_order_id = this.form.purchase_order_id
        }

        // Tambahkan data bank jika metode pembayaran adalah transfer
        if (this.form.payment_method === 'transfer') {
          formData.bank_name = this.form.bank_name
          formData.account_number = this.form.account_number
          formData.account_name = this.form.account_name
        }

        console.log('Sending data to API:', formData)

        // Send data to API
        const { data } = await api.post('/api/v1/purchases', formData)
        this.success = true
        return data // Pastikan mengembalikan data respons API

        return data
      } catch (error) {
        // Improved error handling
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const responseData = error.response.data

          // Log full error response for debugging
          console.error('Full API error response:', responseData)

          if (responseData.message) {
            this.error = responseData.message
          } else if (responseData.error) {
            this.error = responseData.error
          } else {
            this.error = `Error ${error.response.status}: ${error.response.statusText}`
          }

          // If there are validation errors, extract them
          if (responseData.errors) {
            this.validationErrors = Object.values(responseData.errors).flat()
            console.error('Validation errors:', this.validationErrors)
          }
        } else if (error.request) {
          // The request was made but no response was received
          this.error = 'Tidak ada respons dari server. Periksa koneksi internet Anda.'
        } else {
          // Something happened in setting up the request that triggered an Error
          this.error = error.message || 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.'
        }

        console.error('Error submitting form:', error)
        throw new Error(this.error)
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
          payment_method: data.payment_method || '',
          due_date: data.due_date || null,
          bank_name: data.bank_name || '',
          account_number: data.account_number || '',
          account_name: data.account_name || '',
          status: data.status || 'pending',
          paid: Number(data.paid) || 0  // Jumlah yang sudah dibayarkan
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

        // Set purchase_order_id explicitly
        this.form.purchase_order_id = id

        // Set items from purchase order
        this.form.items = data.items.map(item => ({
          product_id: item.product_id,
          product: item.product,
          price: item.price,
          quantity: item.received_quantity || item.quantity,
          subtotal: (item.price * (item.received_quantity || item.quantity)),
          purchase_order_item_id: item.id, // Tambahkan purchase_order_item_id
          is_additional: false // Item dari PO bukan item tambahan
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
          purchase_order_item_id: item.id, // Tambahkan purchase_order_item_id
          is_additional: false // Tandai sebagai item dari PO
        }));

        console.log('Loaded PO data, purchase_order_id set to:', this.form.purchase_order_id);

        this.isDirty = false;
        return true;
      } catch (error) {
        console.error('Error loading PO data:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Clear purchase order ID
    clearPurchaseOrderId() {
      this.form.purchase_order_id = null
      this.purchaseOrderData = null
      console.log('purchase_order_id cleared')
    },

    // Ensure correct data types before submitting
    ensureCorrectDataTypes() {
      // Ensure numeric fields are numbers
      this.form.paid = Number(this.form.paid) || 0
      this.form.discount = Number(this.form.discount) || 0
      this.form.tax = Number(this.form.tax) || 0

      // Ensure items have correct data types
      this.form.items = this.form.items.map(item => ({
        ...item,
        quantity: Number(item.quantity) || 0,
        price: Number(item.price) || 0,
        subtotal: Number(item.price * item.quantity) || 0
      }))
    }
  }
})
