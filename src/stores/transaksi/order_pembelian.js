
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export const usePurchaseOrderStore = defineStore('purchaseOrder', () => {

  const items = ref([])
  const params = ref({
    page: 1,
    per_page: 10,
    sort_by: 'created_at',
    sort_direction: 'desc',
    q: '',
    status: 'semua'
  })
  const searchQuery = ref('')
  const pagination = ref({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0
  })


  const showCreateDialog = ref(false)
  const loading = ref(false)
  const suppliers = ref([])
  const meta = ref(null)
  const products = ref([])
  const purchaseOrder = ref(null)

  // Form state
  const form = ref({
    supplier_id: '',
    date: new Date().toISOString().split('T')[0],
    due_date: '',
    status: 'draft',
    items: []
  })

  // Tambahkan state untuk mode edit
  const editMode = ref(false)
  const editId = ref(null)

  // Reset form dengan tambahan reset mode edit
  const resetForm = () => {
    form.value = {
      supplier_id: '',
      date: new Date().toISOString().split('T')[0],
      due_date: '',
      status: 'draft',
      items: []
    }
    editMode.value = false
    editId.value = null
  }

  // Fungsi untuk mengatur mode edit
  const setEditMode = (id) => {
    editMode.value = true
    editId.value = id
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

      let response;

      if (editMode.value && editId.value) {
        // Update existing PO
        response = await api.put(`/api/v1/purchase-orders/${editId.value}`, form.value);
        console.log('API response (update):', response);
      } else {
        // Create new PO
        response = await api.post('/api/v1/purchase-orders', form.value);
        console.log('API response (create):', response);
      }

      purchaseOrder.value = response?.data || null;

      await fetchPurchaseOrders();
      showCreateDialog.value = false;
      resetForm();

      return response;
    } catch (error) {
      console.error('Error saving purchase order:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  const updateForm = async (id) => {
    loading.value = true
    try {
      console.log('Updating form to API:', form.value);

      // Pastikan endpoint API benar
      const response = await api.put(`/api/v1/purchase-orders/${id}`, form.value);

      console.log('API response:', response);

      await fetchPurchaseOrders();
      showCreateDialog.value = false;
      resetForm();

      return response;
    } catch (error) {
      console.error('Error updating purchase order:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // Data fetching

  const changeStatusParams = (status) => {
    // console.log('Changing status to:', status);
    params.value.status = status
    fetchPurchaseOrders()
  }

  const fetchPurchaseOrders = async () => {
    loading.value = true

    params.value.q = searchQuery.value
    params.value.page = pagination.value.page



    try {
      const { data } = await api.get('/api/v1/purchase-orders',{params: params.value})

      // Gunakan optional chaining dan nullish coalescing untuk penanganan yang lebih ringkas
      items.value = data?.data || []
      meta.value = data?.meta || null
      pagination.value.totalItems = parseInt(data?.meta?.total) || 0
    } catch (error) {
      console.error('Error fetching purchase orders:', error)
      items.value = []
      pagination.value.totalItems = 0
    } finally {
      loading.value = false
    }
  }

  const fetchPurchaseOrderById = async (id) => {
    loading.value = true
    try {
      console.log('Fetching purchase order by ID:', id)
      const { data } = await api.get(`/api/v1/purchase-orders/${id}`)
      console.log('Purchase order data received:', data)

      // Update form dengan data yang diambil
      form.value = {
        supplier_id: data.supplier_id,
        date: data.date,
        due_date: data.due_date,
        status: data.status,
        items: data.items.map(item => ({
          product_id: item.product_id,
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        notes: data.notes || ''
      }

      // Pastikan supplier dimuat
      if (data.supplier) {
        // Jika supplier ada dalam response, tambahkan ke array suppliers
        const supplierExists = suppliers.value.some(s => s.id === data.supplier.id)
        if (!supplierExists) {
          suppliers.value.push(data.supplier)
        }
      } else {
        // Jika tidak ada dalam response, muat supplier berdasarkan ID
        await fetchSupplierById(data.supplier_id)
      }

      return data
    } catch (error) {
      console.error('Error fetching purchase order:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Tambahkan fungsi untuk memuat supplier berdasarkan ID
  const fetchSupplierById = async (supplierId) => {
    if (!supplierId) return

    try {
      console.log('Fetching supplier by ID:', supplierId)
      const { data } = await api.get(`/api/v1/suppliers/${supplierId}`)

      // Periksa apakah supplier sudah ada di array
      const supplierExists = suppliers.value.some(s => s.id === data.id)
      if (!supplierExists) {
        suppliers.value.push(data)
      }

      return data
    } catch (error) {
      console.error('Error fetching supplier:', error)
    }
  }

  // Tambahkan fungsi untuk memuat semua supplier
  const fetchSuppliers = async () => {
    try {
      console.log('Fetching all suppliers')
      const { data } = await api.get('/api/v1/suppliers')
      suppliers.value = data?.data || []
      return suppliers.value
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      return []
    }
  }

  return {
    // State
    showCreateDialog,
    loading,
    suppliers,
    products,
    purchaseOrder,
    form,
    headers,
    items,
    searchQuery,
    pagination,
    editMode,
    editId,

    // Actions
    resetForm,
    addItem,
    removeItem,
    updateItemQuantity,
    submitForm,
    updateForm,
    fetchPurchaseOrders,
    fetchPurchaseOrderById,
    setEditMode,
    fetchSupplierById,
    fetchSuppliers,
    changeStatusParams
  }
})
