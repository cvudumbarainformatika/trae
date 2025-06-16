<template>
  <div class="mb-4 flex space-x-2">
    <div class="flex-1 relative">
      <SearchDropdown ref="productSearchRef" id="product-search" v-model="searchQuery"
        placeholder="Cari produk untuk ditambahkan..." :debounce="300" :min-search-length="3" item-key="id"
        item-label="name" not-found-text="Produk tidak ditemukan"
        not-found-subtext="Coba kata kunci lain atau tambahkan produk baru" add-button-text="Tambah Produk Baru"
        api-url="/api/v1/products/search" api-response-path="data.data" :api-params="{ per_page: 10 }" :use-api="true"
        @select="handleProductSelect" @items-loaded="onProductsLoaded">
        <template #item="{ item }">
          <div class="font-medium text-secondary-900 dark:text-white">{{ item.name }}</div>
          <div class="flex justify-between text-sm">
            <span class="text-secondary-500 dark:text-secondary-400">{{ item.barcode || 'Tidak ada barcode' }}</span>
            <span class="font-medium text-primary-600 dark:text-primary-400">Rp {{ formatCurrency(item.hargabeli)
              }}</span>
          </div>
        </template>
      </SearchDropdown>
    </div>

    <!-- Barcode Scanner Button -->
    <button @click="openScanner"
      class="px-3 py-2 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-md hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200"
      title="Scan Barcode">
      <Icon name="Scan" class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import SearchDropdown from '@/components/ui/SearchDropdown.vue'
import Icon from '@/components/ui/Icon.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'update:modelValue',
  'add-product',
  'open-scanner',
  'products-loaded'
])

// Refs
const productSearchRef = ref(null)



// Computed untuk v-model
const searchQuery = ref(props.modelValue)

// Watch untuk update v-model
watch(searchQuery, (newValue) => {
  emit('update:modelValue', newValue)
})

// Watch untuk update dari parent
watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue
})

// Fungsi untuk memformat angka
const formatCurrency = (value) => {
  if (value === undefined || value === null) return '0'
  return new Intl.NumberFormat('id-ID').format(value)
}

// Fungsi untuk menangani pemilihan produk
const handleProductSelect = (product) => {
  // Emit event untuk menambahkan produk
  emit('add-product', product)

  // Kosongkan text pencarian
  searchQuery.value = ''

  // Fokus kembali ke input pencarian
  nextTick(() => {
    try {
      // Coba gunakan metode focus yang diexpose oleh komponen
      if (productSearchRef.value) {
        productSearchRef.value.focus()
      }
    } catch (error) {
      console.warn('Could not focus search input:', error)

      // Fallback: cari input langsung
      const searchInput = document.querySelector('#product-search input')
      if (searchInput) {
        searchInput.focus()
      }
    }
  })
}

// Handler untuk event items-loaded
const onProductsLoaded = (products) => {
  // Emit event untuk parent component
  emit('products-loaded', products)
}

// Fungsi untuk membuka scanner
const openScanner = () => {
  emit('open-scanner')
}

// Expose methods
defineExpose({
  focus: () => {
    if (productSearchRef.value) {
      productSearchRef.value.focus()
    }
  },
  fetchFromApi: (query) => {
    if (productSearchRef.value) {
      productSearchRef.value.fetchFromApi(query)
    }
  }
})
</script>
