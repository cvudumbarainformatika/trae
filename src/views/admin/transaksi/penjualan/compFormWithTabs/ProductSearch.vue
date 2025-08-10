<template>
  <div class="mb-4 flex space-x-1">
    <div class="flex-1 relative">
      <SearchDropdown v-if="!productSelected" ref="productSearchRef" id="product-search" v-model="searchQuery"
        placeholder="Cari produk untuk ditambahkan..." :debounce="300" :min-search-length="3" item-key="id"
        item-label="name" not-found-text="Produk tidak ditemukan"
        :not-found-subtext="addNotFoundProduct ? 'Coba kata kunci lain atau tambahkan produk baru' : 'Coba kata kunci lain'"
        :add-button-text="addNotFoundProduct ? 'Tambah Produk Baru' : 'T'" api-url="/api/v1/products/search"
        api-response-path="data.data" :api-params="{ per_page: 10 }" :use-api="true" @select="handleProductSelect"
        @items-loaded="onProductsLoaded" :show-add-button="addNotFoundProduct">
        <template #item="{ item }">
          <div class="font-medium text-secondary-900 dark:text-white">{{ item.name }}</div>
          <div class="flex justify-between text-sm">
            <span class="text-secondary-500 dark:text-secondary-400">{{ item.barcode || 'Tidak ada barcode' }}</span>
            <span class="font-medium text-primary-600 dark:text-primary-400">Rp {{ formatCurrency(item.hargajual)
              }}</span>
          </div>
        </template>
      </SearchDropdown>

      <div v-else ref="divRef" tabindex="0" @focus="handleDivFocus"
        class="flex items-center gap-2 py-2 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div class="font-medium text-secondary-900 dark:text-white flex flex-1">{{ productSelected?.name }}</div>
        <div class="font-medium text-secondary-900 dark:text-white justify-end">{{ getHargaJual(productSelected) }}
        </div>
      </div>
    </div>

    <!-- Barcode Scanner Button -->
    <!-- <button @click="openScanner"
      class="px-3 py-2 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-md hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200"
      title="Scan Barcode">
      <Icon name="Scan" class="w-5 h-5" />
    </button> -->
    <div class="flex items-center w-20">
      <BaseInput type="number" v-model.number="qty" ref="qtyRef" @keydown="onQtyKeydown" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed, onMounted } from 'vue'
import { formatRupiah } from '@/utils/uangHelper'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  addNotFoundProduct: {
    type: Boolean,
    default: true
  },
  modelQty: {
    type: Number,
    default: 1
  },
  isiTab: {
    type: Object,
    default: null
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
const qtyRef = ref(null)
const productSelected = ref(null)


onMounted(async () => {
  await nextTick()
  productSearchRef?.value?.focus()
})


// Computed untuk v-model
const searchQuery = ref(props.modelValue)

const qty = ref(props.modelQty)

// Watch untuk update v-model
watch(searchQuery, (newValue) => {
  emit('update:modelValue', newValue)
})

// Watch untuk update dari parent
watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue
})

const onQtyKeydown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    e.stopPropagation();


    emit('add-product', productSelected.value, qty.value)
    handleDivFocus()
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    handleDivFocus()
  }
}

function handleDivFocus() {
  productSelected.value = null
  qty.value = 1
  nextTick(() => {
    productSearchRef.value?.focus?.()
  })
}

// Fungsi untuk memformat angka
const formatCurrency = (value) => {
  if (value === undefined || value === null) return '0'
  return new Intl.NumberFormat('id-ID').format(value)
}

// Fungsi untuk menangani pemilihan produk
// const handleProductSelect = (product) => {
//   // Emit event untuk menambahkan produk
//   emit('add-product', product)

//   // Kosongkan text pencarian
//   searchQuery.value = ''

//   // Fokus kembali ke input pencarian
//   nextTick(() => {
//     try {
//       // Coba gunakan metode focus yang diexpose oleh komponen
//       if (productSearchRef.value) {
//         productSearchRef.value.focus()
//       }
//     } catch (error) {
//       console.warn('Could not focus search input:', error)

//       // Fallback: cari input langsung
//       const searchInput = document.querySelector('#product-search input')
//       if (searchInput) {
//         searchInput.focus()
//       }
//     }
//   })
// }

const handleProductSelect = (product) => {
  // Emit event untuk menambahkan produk
  // emit('add-product', product)
  productSelected.value = product
  qtyRef.value?.inputRef?.focus()
  qtyRef.value?.inputRef?.select()
  searchQuery.value = ''
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

const getHargaJual = (product) => {

  if (props.isiTab.category === 'umum') {
    return formatRupiah(product.hargajual)
  } else if (props.isiTab.category === 'pelanggan') {
    return formatRupiah(product.hargajualcust)
  } else if (props.isiTab.category === 'antar') {
    return formatRupiah(product.hargajualantar)
  } else {
    return formatRupiah(product.hargajual)
  }

}

// Expose methods
defineExpose({
  focus: () => {
    productSearchRef?.value?.focus()
  },
  fetchFromApi: (query) => {
    if (productSearchRef.value) {
      productSearchRef.value.fetchFromApi(query)
    }
  }
})
</script>
