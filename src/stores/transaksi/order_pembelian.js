
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
    date: new Date().toISOString().split('T')[0],
    due_date: '',
    status: 'draft',
    items: []
  })

  // Reset form
  const resetForm = () => {
    form.value = {
      supplier_id: '',
      date: new Date().toISOString().split('T')[0],
      due_date: '',
      status: 'draft',
      items: []
    }
  }

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

  // Tambahkan fungsi untuk menyimpan draft
  const saveDraft = async (isAutosave = false) => {
    // Jika autosave, jangan tampilkan loading state
    if (!isAutosave) loading.value = true
    
    try {
      const response = await api.post('/purchase-orders/draft', form.value)
      
      // Jika bukan autosave, refresh data dan reset form
      if (!isAutosave) {
        await fetchPurchaseOrders()
        showCreateDialog.value = false
        resetForm()
      } else {
        // Jika autosave, update form dengan ID dari response
        if (response.data && response.data.id) {
          form.value.id = response.data.id
        }
      }
      
      return response
    } catch (error) {
      console.error('Error saving draft purchase order:', error)
      throw error
    } finally {
      if (!isAutosave) loading.value = false
    }
  }

  // Data fetching
  const fetchSuppliers = async (q) => {
    try {
      const { data } = await api.get('/api/v1/suppliers', {
        params: {
          q: q
        }
      })
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
          supplier: searchQuery.value,
          page: pagination.value.page,
        }
      })
      
      // Gunakan optional chaining dan nullish coalescing untuk penanganan yang lebih ringkas
      items.value = data?.data || []
      pagination.value.totalItems = data?.meta?.total || 0
      
      // Tambahkan warning jika meta data tidak lengkap
      if (!data?.meta?.total && data) {
        console.warn('Meta data tidak lengkap dalam respons API purchase orders')
      }
    } catch (error) {
      console.error('Error fetching purchase orders:', error)
      items.value = []
      pagination.value.totalItems = 0
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
    saveDraft, // Tambahkan fungsi baru
    fetchSuppliers,
    fetchProducts,
    fetchPurchaseOrders
  }
})
