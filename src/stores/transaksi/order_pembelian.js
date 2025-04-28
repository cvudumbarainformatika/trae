import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios'

export const usePurchaseOrderStore = defineStore('purchaseOrder', () => {
  const showCreateDialog = ref(false)
  const headers = ref([
    { text: 'No PO', value: 'po_number', sortable: true },
    { text: 'Supplier', value: 'supplier.name', sortable: true },
    { text: 'Tanggal', value: 'date', sortable: true },
    { text: 'Jatuh Tempo', value: 'due_date', sortable: true },
    { text: 'Total', value: 'total', sortable: true, align: 'right' },
    { text: 'Status', value: 'status', sortable: true },
    { text: 'Aksi', value: 'actions', align: 'center' }
  ])

  const items = ref([])
  const loading = ref(false)
  const searchQuery = ref('')
  const pagination = ref({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0
  })

  const fetchPurchaseOrders = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/purchase-orders', {
        params: {
          q: searchQuery.value,
          page: pagination.value.page,
          limit: pagination.value.itemsPerPage
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
    showCreateDialog,
    headers,
    items,
    loading,
    searchQuery,
    pagination,
    fetchPurchaseOrders
  }
})