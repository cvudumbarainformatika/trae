import { acceptHMRUpdate, defineStore } from 'pinia'
import { useSatuanStore } from '../admin/satuan'
import { useCategoryStore } from '../admin/category'
import { api } from '@/services/api'
import { useProductStore } from '../admin/product'
import { useNotification } from '@/composables/useNotification'

export const useProductFormStore = defineStore('productForm', {
  state: () => ({
    formData: {
      barcode: '',
      name: '',
      satuan_id: '',
      category_id: '',
      hargabeli: 0,
      hargajual: 0,
      hargajualcust: 0,
      hargajualantar: 0,
      stock: 0,
      minstock: 0,
      rak: '',
      image: null
    },
    imagePreview: null,
    loading: false,
    error: null
  }),

  getters: {
    satuans: () => {
      const satuanStore = useSatuanStore()
      const units = satuanStore.satuans
      return units.map(unit => ({ value: unit?.id, label: unit?.name }))
    },

    categories: () => {
      const categoriesStore = useCategoryStore()
      const units = categoriesStore.categories
      return units.map(unit => ({ value: unit?.id, label: unit?.name }))
    },
    isEdit: () => {
      const storeProduct = useProductStore()
      return storeProduct.isEdit
    }
  },

  actions: {
    initForm(product = null) {
      if (product) {
        this.formData = { ...product }
        this.setIsEdit(true)
      } else {
        this.resetForm()
      }
      this.imagePreview = null
    },

    setIsEdit(value) {
      const storeProduct = useProductStore()
      storeProduct.setEdit(value)
    },

    formatPrice(value) {
      return value?.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    },

    resetForm() {
      // Only reset form data if not editing
      const storeProduct = useProductStore()
      const selectedProduct = storeProduct.selectedProduct
      const isEditing = Boolean(storeProduct.isEdit || selectedProduct?.id)

      if (!isEditing || !selectedProduct) {
        this.formData = {
          barcode: '',
          name: '',
          satuan_id: '',
          category_id: '',
          hargabeli: 0,
          hargajual: 0,
          hargajualcust: 0,
          hargajualantar: 0,
          stock: 0,
          minstock: 0,
          rak: '',
          image: null
        }
      } else {
        this.formData = {
          id: selectedProduct.id,
          barcode: selectedProduct.barcode ?? '',
          name: selectedProduct.name ?? '',
          satuan_id: selectedProduct.satuan_id ?? '',
          category_id: selectedProduct.category_id ?? '',
          hargabeli: selectedProduct.hargabeli ? parseFloat(selectedProduct.hargabeli) : 0,
          hargajual: selectedProduct.hargajual ? parseFloat(selectedProduct.hargajual) : 0,
          hargajualcust: selectedProduct.hargajualcust ? parseFloat(selectedProduct.hargajualcust) : 0,
          hargajualantar: selectedProduct.hargajualantar ? parseFloat(selectedProduct.hargajualantar) : 0,
          stock: selectedProduct.stock ? parseInt(selectedProduct.stock) : 0,
          minstock: selectedProduct.minstock ? parseInt(selectedProduct.minstock) : 0,
          rak: selectedProduct.rak ?? '',
          image: null
        }
      }

      // Reset error state
      this.error = null

      // Reset image preview only if not editing
      if (!isEditing) {
        this.imagePreview = null
      }
    },

    async submitForm() {
      this.loading = true
      this.error = null

      try {
        const productStore = useProductStore()
        const isUpdate = Boolean(this.formData?.id) || this.isEdit

        // Siapkan payload bersih tanpa tercemar relasi object backend
        const payload = {
          barcode: this.formData.barcode ? String(this.formData.barcode).trim() : '',
          name: this.formData.name ? String(this.formData.name).trim() : '',
          satuan_id: this.formData.satuan_id || null,
          category_id: this.formData.category_id || null,
          hargabeli: Number(this.formData.hargabeli) || 0,
          hargajual: Number(this.formData.hargajual) || 0,
          hargajualcust: Number(this.formData.hargajualcust) || 0,
          hargajualantar: Number(this.formData.hargajualantar) || 0,
          stock: Number(this.formData.stock) || 0,
          minstock: Number(this.formData.minstock) || 0,
          rak: this.formData.rak ? String(this.formData.rak).trim() : ''
        }

        let response
        if (isUpdate && this.formData?.id) {
          response = await api.put(`/api/v1/products/${this.formData.id}`, payload)
        } else {
          response = await api.post('/api/v1/products', payload)
        }

        const { notify } = useNotification()
        notify({
          title: 'Berhasil',
          message: isUpdate ? 'Produk berhasil diperbarui' : 'Produk berhasil ditambahkan',
          type: 'success'
        })

        await productStore.fetchProducts()
        productStore.setShowProductForm(false)

        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to save product'
        const { notify } = useNotification()
        notify({
          title: 'Simpan / Update Gagal',
          message: this.error,
          type: 'error'
        })
        throw this.error
      } finally {
        this.loading = false
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductFormStore, import.meta.hot))
}
