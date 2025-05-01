
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

  const addItem = (item) => {
    // Validasi data sesuai aturan backend
    if (!item.product_id) {
      console.error('product_id diperlukan');
      return;
    }

    // Pastikan quantity ada dan valid
    const quantity = item.quantity || 1;
    if (quantity < 1) {
      console.error('quantity minimal 1');
      return;
    }

    // Pastikan price ada dan valid
    const price = item.price || item.product?.hargabeli || 0;
    if (price < 0) {
      console.error('price tidak boleh negatif');
      return;
    }

    // Hitung total
    const total = quantity * price;

    // Periksa apakah produk sudah ada di dalam daftar
    const existingItemIndex = form.value.items.findIndex(
      existingItem => existingItem.product_id === item.product_id
    );

    if (existingItemIndex >= 0) {
      // Jika produk sudah ada, tambahkan quantity dan update total
      const updatedQuantity = form.value.items[existingItemIndex].quantity + 1;
      const updatedTotal = updatedQuantity * form.value.items[existingItemIndex].price;

      // Buat salinan item yang diperbarui
      const updatedItem = {
        ...form.value.items[existingItemIndex],
        quantity: updatedQuantity,
        total: updatedTotal
      };

      // Hapus item dari posisi saat ini
      form.value.items.splice(existingItemIndex, 1);

      // Tambahkan item yang diperbarui ke awal array
      form.value.items.unshift(updatedItem);
    } else {
      // Jika produk belum ada, tambahkan sebagai item baru di awal array
      form.value.items.unshift({
        product_id: item.product_id,
        product: { ...item.product },
        quantity: quantity,
        price: price,
        total: total
      });
    }
  }

  const removeItem = (index) => {
    form.value.items.splice(index, 1);
  }

  // Tambahkan fungsi untuk increment/decrement quantity
  const updateItemQuantity = (index, newQuantity) => {
    if (index < 0 || index >= form.value.items.length) return;

    // Pastikan quantity minimal 1
    newQuantity = Math.max(1, newQuantity);

    // Update quantity dan total
    const item = form.value.items[index];
    const newTotal = newQuantity * item.price;

    form.value.items[index] = {
      ...item,
      quantity: newQuantity,
      total: newTotal
    };
  }

  const submitForm = async () => {
    loading.value = true
    try {
      console.log('Submitting form to API:', form.value);

      // Pastikan endpoint API benar
      const response = await api.post('/api/v1/purchase-orders', form.value);

      console.log('API response:', response);

      await fetchPurchaseOrders();
      showCreateDialog.value = false;
      resetForm();

      return response;
    } catch (error) {
      console.error('Error creating purchase order:', error);
      throw error;
    } finally {
      loading.value = false;
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
    updateItemQuantity,
    submitForm,
    fetchSuppliers,
    fetchProducts,
    fetchPurchaseOrders
  }
})
