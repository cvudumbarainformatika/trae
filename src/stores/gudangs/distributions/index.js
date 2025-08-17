import { acceptHMRUpdate, defineStore } from 'pinia'
import { api } from '@/services/api'

export const useDistributionGudangStore = defineStore('distribution-gudang-store', {
  state: () => ({
    items: [],
    meta: null,
    params: {
      page: 1,
      per_page: 10,
      sort_by: 'created_at',
      sort_direction: 'desc',
      q: '',
      status: 'semua',
      start_date: null,
      end_date: null
    },
    pagination: {
      page: 1,
      itemsPerPage: 10,
      totalItems: 0
    },
    loading: false,
    error: null,
    showCreateDialog: false,
    item: null,
    showDetailDialog: false,
    detail: null,



    form:{
      out_at: new Date().toISOString().split('T')[0],
      status: 'draft',
      items: [],
      notes: null,
    },
    editMode: false,
    editId: null,
    loadingSave: false




  }),

  getters: {
    paginationInfo: (state) => {
      return {
        currentPage: state.pagination.page,
        totalPages: Math.ceil(state.pagination.totalItems / state.pagination.itemsPerPage),
        totalItems: state.pagination.totalItems,
        itemsPerPage: state.pagination.itemsPerPage
      }
    },
    filteredItems: (state) => {
      return state.items
    }
  },

  actions: {
    async fetchData() {
      this.loading = true
      try {
        const { data } = await api.get('/api/v1/gudangs/distribution', {
          params: this.params
        })

        // console.log('return_penjualan', data);

        this.items = data?.data || []
        this.pagination.totalItems = parseInt(data?.meta?.total) || 0
        this.meta = data?.meta || null
        return this.items
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch sales'
        console.error('Error fetching sales:', error)
        return []
      } finally {
        this.loading = false
      }
    },





    showDetail(item) {
      this.item = item
      this.showDetailDialog = true
    },

    closeDetailDialog() {
      this.showDetailDialog = false
    },

    setPage(page) {
      this.pagination.page = page
      this.params.page = page
      this.fetchData()
    },

    setSearchQuery(query) {
      this.params.q = query
      this.params.page = 1
      this.pagination.page = 1
      this.fetchData()
    },

    setStatusFilter(status) {
      this.params.status = status
      this.params.page = 1
      this.pagination.page = 1
      this.fetchData()
    },

    setDateRange(startDate, endDate) {
      this.params.start_date = startDate
      this.params.end_date = endDate
      this.params.page = 1
      this.pagination.page = 1
      this.fetchData()
    },

    handlePageChange(page) {
      if (page < 1 || page > Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage)) {
        return
      }
      this.pagination = {
        ...this.pagination,
        page
      }
      this.params.page = page
    },




    addItem(item){
    // Validasi data sesuai aturan backend
    if (!item.product_id) {
      console.error('product_id diperlukan');
      return;
    }

    // Pastikan quantity ada dan valid
    const quantity = item.qty || 1;
    if (quantity < 1) {
      console.error('quantity minimal 1');
      return;
    }

    // Pastikan price ada dan valid
    // const price = item.price || item.product?.hargabeli || 0;
    // if (price < 0) {
    //   console.error('price tidak boleh negatif');
    //   return;
    // }

    // Hitung total
    // const total = quantity * price;

    // Periksa apakah produk sudah ada di dalam daftar
    const existingItemIndex = this.form?.items?.findIndex(
      existingItem => existingItem.product_id === item.product_id
    );

    if (existingItemIndex >= 0) {
      // Jika produk sudah ada, tambahkan quantity dan update total
      const updatedQuantity = this.form.items[existingItemIndex]?.qty + 1;
      // const updatedTotal = updatedQuantity * form.value.items[existingItemIndex].price;

      // Buat salinan item yang diperbarui
      const updatedItem = {
        ...this.form.items[existingItemIndex],
        qty: updatedQuantity
      };

      // Hapus item dari posisi saat ini
      this.form?.items.splice(existingItemIndex, 1);

      // Tambahkan item yang diperbarui ke awal array
      this.form.items.unshift(updatedItem);
    } else {
      // Jika produk belum ada, tambahkan sebagai item baru di awal array
      this.form.items.unshift({
        product_id: item.product_id,
        product: { ...item.product },
        qty: quantity
      });
    }
    },

    updateItemQuantity(index, newQuantity){
      if (index < 0 || index >= this.form?.items.length) return;

      // Pastikan quantity minimal 1
      newQuantity = Math.max(1, newQuantity);

      // Update quantity dan total
      const item = this.form?.items[index];
      // const newTotal = newQuantity * item.price;

      this.form.items[index] = {
        ...item,
        qty: newQuantity
      };
    },

    removeItem(index) {
      if (index < 0 || index >= this.form?.items?.length) return;
      this.form.items.splice(index, 1);
    },

    resetForm(){
      this.form = {
        // supplier_id: '',
        // supplier: null,
        out_at: new Date().toISOString().split('T')[0],
        status: 'draft',
        items: [],
        notes: null
      }
      this.editMode = false
      this.editId = null
    },
    setEditMode(id){
      this.editMode = true
      this.editId = id
    },


    async submitForm (){
    this.loadingSave = true
    try {

      let response;

      if (this.editMode && this.editId) {
        // Update existing
        response = await api.put(`/api/v1/gudangs/distribution/${editId.value}`, this.form);
        // console.log('API response (update):', response);
      } else {
        // Create new
        response = await api.post('/api/v1/gudangs/distribution', this.form);
        // console.log('API response (create):', response);
      }

      this.item = response?.data || null;

      await this.fetchData();
      this.showCreateDialog = false;
      this.resetForm();

      return response;
    } catch (error) {
      console.error('Error saving purchase order:', error);
      throw error;
    } finally {
      this.loadingSave = false;
    }
  }







  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDistributionGudangStore, import.meta.hot))
}
