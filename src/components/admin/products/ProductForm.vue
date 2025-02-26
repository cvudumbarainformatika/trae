<script setup>
import { useProductFormStore } from '@/stores/forms/productForm'
import noImage from '@/assets/no-image.svg'

const props = defineProps({
  product: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const productFormStore = useProductFormStore()
const { formData, imagePreview, satuans, categories, formatPrice, submitForm } = productFormStore

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    imagePreview.value = URL.createObjectURL(file)
    formData.value.image = file
  }
}

const handleSubmit = () => {
  // emit('submit', formData.value)
  // console.log('form',formData);
  submitForm()
  
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="relative max-w-4xl mx-auto bg-gray-300 dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300">
    <div class="p-4 space-y-4 pb-[100px]">
      <!-- Form Header -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-3">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Produk {{ isEdit ? 'Edit' : 'Baru' }} </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Isi informasi di bawah untuk {{ isEdit ? 'memperbarui' : 'membuat' }} produk Anda.</p>
      </div>

      <!-- Basic Information Section -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
          <span class="material-icons text-primary-500">info</span>
          <span>Informasi Dasar</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
          <BaseInput
            v-model="formData.barcode"
            label="Barcode"
            type="text"
            required
            clearable
            placeholder="Masukkan barcode produk"
          />

          <BaseInput
            v-model="formData.name"
            label="Nama Produk"
            type="text"
            required
            clearable
            placeholder="Masukkan nama produk"
          />

          <div class="relative">
            <BaseSelect
              v-model="formData.satuan_id"
              label="Satuan"
              :options="satuans"
              option-label="label"
              option-value="value"
              required
              clearable
              placeholder="Pilih Satuan"
            />
          </div>

          <div class="relative">
            <BaseSelect
              v-model="formData.category_id"
              label="Kategori"
              option-label="label"
              option-value="value"
              :options="categories"
              placeholder="Pilih Kategori"
            />
          </div>
        </div>
      </div>

      <!-- Pricing Information Section -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
          <span class="material-icons text-primary-500">payments</span>
          <span>Detail Harga</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
          <BaseInput
            v-model.number="formData.hargabeli"
            label="Harga Beli"
            type="number"
            min="0"
            placeholder="0"
          />

          <BaseInput
            v-model.number="formData.hargajual"
            label="Harga Regular"
            type="number"
            min="0"
            placeholder="0"
          />

          <BaseInput
            v-model.number="formData.hargajualcust"
            label="Harga Customer"
            type="number"
            min="0"
            placeholder="0"
          />

          <BaseInput
            v-model.number="formData.hargajualantar"
            label="Harga Antar"
            type="number"
            min="0"
            placeholder="0"
          />
        </div>
      </div>

      <!-- Stock Information Section -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
          <span class="material-icons text-primary-500">inventory</span>
          <span>Manajemen Stok</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
          <BaseInput
            v-model.number="formData.stock"
            label="Stok Awal"
            type="number"
            min="0"
            placeholder="Masukkan stok awal"
          />

          <BaseInput
            v-model.number="formData.minstock"
            label="Stok Minimum"
            type="number"
            min="0"
            placeholder="Masukkan stok minimum"
          />

          <BaseInput
            v-model="formData.rak"
            label="Lokasi Rak"
            type="text"
            placeholder="Masukkan lokasi rak"
          />
        </div>
      </div>

      <!-- Image Upload Section -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
          <span class="material-icons text-primary-500">image</span>
          <span>Gambar Produk</span>
        </h3>
        <div class="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
          <div class="flex items-center space-x-6">
            <div
              class="h-40 w-40 overflow-hidden rounded-lg bg-white dark:bg-dark-600 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 transition-all duration-300 hover:border-primary-500 dark:hover:border-primary-500"
            >
              <img
                :src="imagePreview || formData.image || noImage"
                class="h-full w-full object-cover"
                alt="Preview produk"
              >
            </div>
            <div class="flex-1 space-y-2">
              <input
                type="file"
                accept="image/*"
                @change="handleImageChange"
                class="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4 file:rounded-md
                  file:border-0 file:text-sm file:font-medium
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100
                  dark:file:bg-primary-900 dark:file:text-primary-300
                  transition-all duration-300"
              >
              <p class="text-xs text-gray-500 dark:text-gray-400">Format yang didukung: JPG, PNG, GIF (maks. 5MB)</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700 space-x-4 flex justify-end fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-700 w-full">
        <button
          type="button"
          @click="handleCancel"
          class="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
        >
          Batal
        </button>
        <button
          type="submit"
          class="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 flex items-center space-x-2"
        >
          <span class="material-icons text-sm"></span>
          <span>{{ isEdit ? 'Perbarui' : 'Buat' }} Produk</span>
        </button>
      </div>
  </form>
</template>