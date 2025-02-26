import { acceptHMRUpdate, defineStore } from 'pinia'
import { useSatuanStore } from '../admin/satuan'
import { useCategoryStore } from '../admin/category'
import { api } from '@/services/api'
import { useProductStore } from '../admin/product'

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
      const editing = storeProduct.isEdit
      const selectedProduct = storeProduct.selectedProduct

      
      if (!editing) {
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
          ...selectedProduct,
          hargabeli: selectedProduct.hargabeli ? parseFloat(selectedProduct.hargabeli) : 0,
          hargajual: selectedProduct.hargajual ? parseFloat(selectedProduct.hargajual) : 0,
          hargajualcust: selectedProduct.hargajualcust ? parseFloat(selectedProduct.hargajualcust) : 0,
          hargajualantar: selectedProduct.hargajualantar ? parseFloat(selectedProduct.hargajualantar) : 0,
          stock: selectedProduct.stock ? parseInt(selectedProduct.stock) : 0,
          minstock: selectedProduct.minstock ? parseInt(selectedProduct.minstock) : 0,
        }
      }
      
      console.log('formData', this.formData);
      
      // Reset error state
      this.error = null
      
      // Reset image preview only if not editing
      if (!editing) {
        this.imagePreview = null
      }

    },

    async submitForm() {
      console.log('submitForm', this.formData)
      
      this.loading = true
      this.error = null
      
      try {
        const formDataToSubmit = new FormData()
        
        // Append all form fields to FormData
        Object.keys(this.formData).forEach(key => {
          if (this.formData[key] !== null) {
            formDataToSubmit.append(key, this.formData[key])
          }
        })

        let response
        if (this.isEdit) {
          response = await api.put(`/api/v1/products/${this.formData.id}`, formDataToSubmit, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        } else {
          response = await api.post('/api/v1/products', formDataToSubmit, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        }

        // this.resetForm()
        const productStore = useProductStore()
        productStore.fetchProducts()
        productStore.setShowProductForm(false)

        return response.data

      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to save product'
        throw this.error
      } finally {
        this.loading = false
        const productStore = useProductStore()
        productStore.setShowProductForm(false)
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductFormStore, import.meta.hot))
}