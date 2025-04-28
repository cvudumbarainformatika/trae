
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export const usePurchaseOrderStore = defineStore('purchaseOrder', () => {
  const showCreateDialog = ref(false)
  const loading = ref(false)
  const suppliers = ref([])
  const products = ref([])
  
  // Form state
  const form = ref({
    supplier_id: '',
    order_number: '',
    order_date: new Date().toISOString().split('T')[0],
    notes: '',
    status: 'draft',
    items: [
      { product_id: '', quantity: 1, price: 0 }
    ]
  })

  // Existing state
  const headers = ref([
    { text: 'No. PO', value: 'po_number' },
    { text: 'Tanggal', value: 'date' },
    { text: 'Supplier', value: 'supplier_name' },
    { text: 'Total', value: 'total_amount' },
    { text: 'Status', value: 'status' },
    { text: 'Actions', value: 'actions', class: 'text-right' }
  ])

  const items = ref([])
  const searchQuery = ref('')
  const pagination = ref({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0
  })

  // Form actions
  const resetForm = () => {
    form.value = {
      supplier_id: '',
      po_number: '',
      date: new Date().toISOString().split('T')[0],
      due_date: '',
      items: [
        { product_id: '', quantity: 1, price: 0 }
      ]
    }
  }

  const addItem = () => {
    form.value.items.push({ product_id: '', quantity: 1, price: 0 })
  }

  const removeItem = (index) => {
    form.value.items.splice(index, 1)
  }

  const submitForm = async () => {
    loading.value = true
    try {
      await api.post('/purchase-orders', form.value)
      await fetchPurchaseOrders()
      showCreateDialog.value = false
      resetForm()
    } catch (error) {
      console.error('Error creating purchase order:', error)
    } finally {
      loading.value = false
    }
  }

  // Data fetching
  const fetchSuppliers = async () => {
    try {
      const { data } = await api.get('/suppliers')
      suppliers.value = data.data
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products')
      products.value = data.data
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchPurchaseOrders = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/api/v1/purchase-orders', {
        params: {
          supplier: searchQuery.value, // menggunakan parameter yang didokumentasikan
          page: pagination.value.page,
          // limit dihapus karena tidak ada di dokumentasi
        }
      })
      items.value = data.data
      pagination.value.totalItems = data.meta.total
    } catch (error) {
      console.error('Error fetching purchase orders:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    showCreateDialog,
    loading,
    suppliers,
    products,
    form,
    headers,
    items,
    searchQuery,
    pagination,

    // Actions
    resetForm,
    addItem,
    removeItem,
    submitForm,
    fetchSuppliers,
    fetchProducts,
    fetchPurchaseOrders
  }
})
