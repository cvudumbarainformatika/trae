<template>
  <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 h-full transition-all duration-300 hover:shadow-md">
    <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center justify-between">
      <span class="flex items-center">
        <Icon name="ShoppingBasket" class="mr-2 text-primary-500" /> Item Order
      </span>
      <span class="text-sm font-normal text-secondary-500 dark:text-secondary-400">
        {{ items.length }} item
      </span>
    </h3>

    <!-- Product Search -->
    <div class="relative mb-4">
      <div class="flex gap-2">
        <div class="flex-1">
          <SearchDropdown
            v-model="productSearchModel"
            ref="productSearchRef"
            placeholder="Cari produk untuk ditambahkan..."
            :debounce="300"
            :min-search-length="3"
            item-key="id"
            item-label="name"
            not-found-text="Produk tidak ditemukan"
            not-found-subtext="Coba kata kunci lain atau tambahkan produk baru"
            add-button-text="Tambah Produk Baru"
            api-url="/api/v1/products/search"
            api-response-path="data.data"
            :api-params="{ per_page: 10 }"
            :use-api="true"
            @select="addProductToOrder"
            @items-loaded="onProductsLoaded"
          >
            <template #item="{ item }">
              <div class="font-medium text-secondary-900 dark:text-white">{{ item.name }}</div>
              <div class="flex justify-between text-sm">
                <span class="text-secondary-500 dark:text-secondary-400">{{ item.barcode || 'Tidak ada barcode' }}</span>
                <span class="font-medium text-primary-600 dark:text-primary-400">Rp {{ formatNumber(item.hargabeli) }}</span>
              </div>
            </template>
          </SearchDropdown>
        </div>

        <!-- Barcode Scanner Button -->
        <button
          @click="openBarcodeScanner"
          class="px-3 py-2 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-md hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors duration-200"
          title="Scan Barcode"
        >
          <Icon name="Scan" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Barcode Scanner Component -->
    <BarcodeScanner
      v-if="showScanner"
      @scan-success="handleBarcodeScan"
      @scan-error="showScanner = false"
      @close="showScanner = false"
    />

    <!-- Selected Products List -->
    <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2">
      <!-- Tampilan saat tidak ada item yang dipilih -->
      <div v-if="items.length === 0" class="text-center py-12 text-secondary-400 dark:text-secondary-500 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border-2 border-dashed border-secondary-200 dark:border-secondary-700">
        <Icon name="ShoppingBasket" class="w-16 h-16 mb-3 mx-auto" />
        <h3 class="text-lg font-medium text-secondary-700 dark:text-secondary-300 mb-2">Belum Ada Item</h3>
        <p class="text-sm max-w-md mx-auto">
          Cari dan tambahkan produk ke order pembelian Anda menggunakan kotak pencarian di atas
        </p>
        <!-- <div class="mt-4">
          <button @click="focusProductSearch" class="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium flex items-center gap-1 mx-auto">
            <i class="ri-add-line"></i> Tambah Produk
          </button>
        </div> -->
      </div>

      <div v-for="(item, index) in items" :key="index"
           class="p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg border-l-4 border-primary-500 animate-fadeIn">
        <!-- Header: Product name, barcode, and delete button -->
        <div class="flex justify-between items-start mb-2">
          <div class="flex-1">
            <div class="font-medium text-secondary-900 dark:text-white">{{ item.product?.name || 'Tidak ada nama produk' }}</div>
            <div class="text-xs text-secondary-500 dark:text-secondary-400">
              {{ item.product?.barcode || 'Tidak ada barcode' }}
            </div>
          </div>

          <button @click="removeItem(index)"
                  class="text-red-500 hover:text-red-600 dark:hover:text-red-400 ml-2">
            <Icon name="Trash" class="w-4 h-4" />
          </button>
        </div>

        <!-- Price and quantity controls in one row -->
        <div class="flex justify-between items-center mt-1">
          <div class="flex items-center gap-2">
            <div class="relative">
              <span class="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-secondary-500 dark:text-secondary-400">Rp</span>
              <input
                v-model.number="item.price"
                type="number"
                min="0"
                @input="updateItemTotal(index)"
                class="w-36 h-7 pl-7 text-sm rounded-l border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-800 focus:outline-none focus:ring-1 focus:ring-primary-500 text-secondary-900 dark:text-white"
              />
            </div>
            <span class="text-xs text-secondary-500 dark:text-secondary-400">×</span>
            <div class="flex items-center">
              <button @click="decrementQuantity(index)"
                      class="w-6 h-6 flex items-center justify-center rounded-l-md bg-secondary-200 dark:bg-secondary-600 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-300 dark:hover:bg-secondary-500 transition-colors">
                <Icon name="Minus" class="w-3 h-3" />
              </button>
              <input v-model.number="item.quantity" type="number" min="1"
                     class="w-14 h-6 text-center text-xs border-y border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-800 focus:outline-none focus:ring-1 focus:ring-primary-500 text-secondary-900 dark:text-white" />
              <button @click="incrementQuantity(index)"
                      class="w-6 h-6 flex items-center justify-center rounded-r-md bg-secondary-200 dark:bg-secondary-600 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-300 dark:hover:bg-secondary-500 transition-colors">
                <Icon name="Plus" class="w-3 h-3" />
              </button>
            </div>
          </div>
          <div class="font-medium text-primary-600 dark:text-primary-400 text-sm">
            Rp {{ formatNumber(item.price * item.quantity) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Order Summary -->
    <div class="mt-6 pt-4 border-t border-secondary-200 dark:border-secondary-700">
      <div class="flex justify-between items-center font-medium text-lg">
        <span class="text-secondary-900 dark:text-white">Total</span>
        <span class="text-primary-600 dark:text-primary-400">Rp {{ formatNumber(calculateTotal()) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import Icon from '@/components/ui/Icon.vue'
import SearchDropdown from '@/components/ui/SearchDropdown.vue'
import BarcodeScanner from '@/components/admin/BarcodeScanner.vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  productSearch: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'update:productSearch',
  'add-product',
  'remove-item',
  'update-quantity',
  'update-price',
  'products-loaded',
  'open-scanner',
  'barcode-scan'
])

// Refs
const productSearchRef = ref(null)
const showScanner = ref(false)

// Computed properties for v-model binding
const productSearchModel = computed({
  get: () => props.productSearch,
  set: (value) => emit('update:productSearch', value)
})

// Methods
const formatNumber = (value) => {
  return new Intl.NumberFormat('id-ID').format(value)
}

const calculateTotal = () => {
  return props.items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

const addProductToOrder = (product) => {
  emit('add-product', product)
}

const removeItem = (index) => {
  emit('remove-item', index)
}

const incrementQuantity = (index) => {
  const currentQuantity = props.items[index].quantity
  emit('update-quantity', { index, quantity: currentQuantity + 1 })
}

const decrementQuantity = (index) => {
  const currentQuantity = props.items[index].quantity
  if (currentQuantity > 1) {
    emit('update-quantity', { index, quantity: currentQuantity - 1 })
  }
}

const updateItemTotal = (index) => {
  const item = props.items[index]
  emit('update-price', { index, price: item.price })
}

const focusProductSearch = () => {
  nextTick(() => productSearchRef.value?.focus())
}

const openBarcodeScanner = () => {
  showScanner.value = true
  emit('open-scanner')
}

const handleBarcodeScan = (barcode) => {
  showScanner.value = false
  productSearchModel.value = barcode
  emit('barcode-scan', barcode)

  // Gunakan ref untuk memanggil metode fetchFromApi pada komponen SearchDropdown
  if (productSearchRef.value) {
    productSearchRef.value.fetchFromApi(barcode)
  }
}

const onProductsLoaded = (products) => {
  emit('products-loaded', products)
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Sembunyikan tombol default increment/decrement pada input number */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
}
</style>
