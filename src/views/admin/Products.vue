<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { useProductStore } from '../../stores/admin/product'
import ProductForm from '../../components/admin/ProductForm.vue'
import BarcodeScanner from '../../components/admin/BarcodeScanner.vue'
import BatchOperationsModal from '../../components/admin/BatchOperationsModal.vue'
import noImage from '../../assets/no-image.svg'

// Edit state
const selectedProduct = ref(null)
const isEdit = ref(false)
const showScanner = ref(false)
const showBatchOperations = ref(false)

// Store initialization
const themeStore = useThemeStore()
const productStore = useProductStore()

// Add new filter state
const showFilters = ref(false)
const filters = ref({
  category: '',
  priceRange: {
    min: null,
    max: null
  },
  stockLevel: {
    min: null,
    max: null
  },
  status: 'all' // 'all', 'in-stock', 'low-stock', 'out-of-stock'
})

// Add computed property for categories
const categories = computed(() => {
  const uniqueCategories = new Set(productStore.products.map(p => p.category))
  return Array.from(uniqueCategories).sort()
})

// Computed properties
const viewMode = computed(() => productStore.viewMode)

const showProductForm = computed({
  get: () => productStore.showProductForm,
  set: (value) => productStore.setShowProductForm(value)
})

const searchQuery = computed({
  get: () => productStore.searchQuery,
  set: (value) => productStore.setSearchQuery(value)
})

// Enhance filtered products computation
const filteredProducts = computed(() => {
  return productStore.products.filter(product => {
    // Search query filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matchesSearch = 
        product.name.toLowerCase().includes(query) ||
        product.barcode.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Category filter
    if (filters.value.category && product.category !== filters.value.category) {
      return false
    }

    // Price range filter
    if (filters.value.priceRange.min && product.regularPrice < filters.value.priceRange.min) {
      return false
    }
    if (filters.value.priceRange.max && product.regularPrice > filters.value.priceRange.max) {
      return false
    }

    // Stock level filter
    if (filters.value.stockLevel.min && product.currentStock < filters.value.stockLevel.min) {
      return false
    }
    if (filters.value.stockLevel.max && product.currentStock > filters.value.stockLevel.max) {
      return false
    }

    // Status filter
    if (filters.value.status !== 'all') {
      switch (filters.value.status) {
        case 'in-stock':
          if (product.currentStock <= product.minStock) return false
          break
        case 'low-stock':
          if (product.currentStock > product.minStock || product.currentStock === 0) return false
          break
        case 'out-of-stock':
          if (product.currentStock !== 0) return false
          break
      }
    }

    return true
  })
})

// Reset filters function
const resetFilters = () => {
  filters.value = {
    category: '',
    priceRange: {
      min: null,
      max: null
    },
    stockLevel: {
      min: null,
      max: null
    },
    status: 'all'
  }
}

// Pagination state
const currentPage = ref(1)

// Watch for search query changes to reset pagination
watch(searchQuery, () => {
  currentPage.value = 1
})

const pagination = computed(() => {
  const totalItems = filteredProducts.value.length
  const itemsPerPage = 12
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Calculate visible page numbers
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  return {
    currentPage: currentPage.value,
    totalPages,
    itemsPerPage,
    startPage,
    endPage,
    totalItems
  }
})

// Pagination methods
const changePage = (page) => {
  currentPage.value = page
}

const getPageItems = computed(() => {
  const start = (currentPage.value - 1) * pagination.value.itemsPerPage
  const end = start + pagination.value.itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// Handle edit product
const handleEditProduct = (product) => {
  selectedProduct.value = { ...product }
  showProductForm.value = true
  isEdit.value = true
}
const showDeleteConfirm = (product) => {
  selectedProduct.value = { ...product }
  productStore.showDeleteConfirm = true
}

// Handle form submission
const handleProductSubmit = (productData) => {
  if (isEdit.value) {
    productStore.updateProduct({ ...productData, id: selectedProduct.value.id })
  } else {
    productStore.addProduct(productData)
  }
  showProductForm.value = false
  selectedProduct.value = null
  isEdit.value = false
}

// Handle form cancellation
const handleProductCancel = () => {
  showProductForm.value = false
  selectedProduct.value = null
  isEdit.value = false
}

// View mode handlers
const setViewMode = (mode) => {
  productStore.setViewMode(mode)
}
</script>

<template>
  <div class="flex flex-col h-full space-y-6">
    <!-- Header Section -->
    <div class="flex">
      <div class="flex items-center justify-between w-full">
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">Product Management</h1>
      </div>
    </div>

    <!-- Filters and Search Section -->
    <div class="flex-1 flex overflow-hidden w-full space-y-4">
      <div class="flex flex-col h-full w-full space-y-4">
        <div class="flex items-center space-x-4">
          <button
            data-filter-toggle
            @click="showFilters = !showFilters"
            class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-dark-800 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <Icon name="filter" class="w-4 h-4" />
            <span>Filters</span>
            <span v-if="filters.category || filters.priceRange.min || filters.priceRange.max || filters.stockLevel.min || filters.stockLevel.max || filters.status !== 'all'" 
              class="ml-2 px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full"
            >
              Active
            </span>
          </button>
          <button
            v-if="filters.category || filters.priceRange.min || filters.priceRange.max || filters.stockLevel.min || filters.stockLevel.max || filters.status !== 'all'"
            @click="resetFilters"
            class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none transition-colors duration-200"
          >
            Reset
          </button>
          <div class="flex items-center space-x-2 bg-white dark:bg-dark-800 rounded-lg">
            <IconButton 
              variant="info" 
              size="md"
              @click="showProductForm = true"
            >
              <template #icon>
                <Icon name="Plus" class="w-5 h-5" />
              </template>
            </IconButton>
            <IconButton
              variant="info"
              size="md"
              @click="showBatchOperations = true"
            >
              <template #icon>
                <Icon name="Settings" class="w-5 h-5" />
              </template>
            </IconButton>
            <IconButton
              variant="info"
              size="md"
              @click="showScanner = true"
            >
              <template #icon>
                <Icon name="Scan" class="w-5 h-5" />
                <!-- Barcode Scanner -->
  <BarcodeScanner
    v-if="showScanner"
    @scan-success="(result) => {
      searchQuery = result
      showScanner = false
    }"
    @scan-error="() => showScanner = false"
    @close="showScanner = false"
  />
</template>
            </IconButton>
            <IconButton
              @click="setViewMode('grid')"
              :variant="viewMode === 'grid' ? 'primary' : 'ghost'"
              size="md"
            >
              <template #icon>
                <Icon name="LayoutGrid" class="w-5 h-5" />
                <!-- Barcode Scanner -->
  <BarcodeScanner
    v-if="showScanner"
    @scan-success="(result) => {
      searchQuery = result
      showScanner = false
    }"
    @scan-error="() => showScanner = false"
    @close="showScanner = false"
  />
</template>
            </IconButton>
            <IconButton
              @click="setViewMode('table')"
              :variant="viewMode === 'table' ? 'primary' : 'ghost'"
              size="md"
            >
              <template #icon>
                <Icon name="Table" class="w-5 h-5" />
                <!-- Barcode Scanner -->
  <BarcodeScanner
    v-if="showScanner"
    @scan-success="(result) => {
      searchQuery = result
      showScanner = false
    }"
    @scan-error="() => showScanner = false"
    @close="showScanner = false"
  />
</template>
            </IconButton>
          </div>
          <div class="flex-1">
            <BaseInput
              v-model="searchQuery"
              placeholder="Search products..."
              type="text"
            />
          </div>
        </div>

        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <div
            v-if="showFilters"
            ref="filterRef"
            class="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 mb-6 space-y-6 relative"
          >
            <!-- Close Button -->
            <button
              @click="showFilters = false"
              class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            >
              <Icon name="XMarkIcon" class="w-5 h-5" />
            </button>
            <!-- Category Filter -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select
                v-model="filters.category"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-dark-700 dark:text-white"
              >
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <!-- Price Range Filter -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Price Range</label>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <input
                    v-model.number="filters.priceRange.min"
                    type="number"
                    placeholder="Min Price"
                    class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-dark-700 dark:text-white"
                  >
                </div>
                <div>
                  <input
                    v-model.number="filters.priceRange.max"
                    type="number"
                    placeholder="Max Price"
                    class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-dark-700 dark:text-white"
                  >
                </div>
              </div>
            </div>

            <!-- Stock Level Filter -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Level</label>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <input
                    v-model.number="filters.stockLevel.min"
                    type="number"
                    placeholder="Min Stock"
                    class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-dark-700 dark:text-white"
                  >
                </div>
                <div>
                  <input
                    v-model.number="filters.stockLevel.max"
                    type="number"
                    placeholder="Max Stock"
                    class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-dark-700 dark:text-white"
                  >
                </div>
              </div>
            </div>

            <!-- Status Filter -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <div class="grid grid-cols-4 gap-4">
                <button
                  v-for="status in ['all', 'in-stock', 'low-stock', 'out-of-stock']"
                  :key="status"
                  @click="filters.status = status"
                  :class="[
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                    filters.status === status
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                      : 'bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                  ]"
                >
                  {{ status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }}
                </button>
              </div>
            </div>
          </div>
        </transition>

        <!-- Products Content -->
        <div class="flex-1 overflow-y-scroll">
          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
            <Card v-for="product in getPageItems" 
                  :key="product.id"
                  class="flex flex-col h-full transition-transform duration-200 hover:scale-105"
                  padding="p-4">
              <div class="relative aspect-square w-full mb-4 overflow-hidden rounded-lg">
                <img :src="product.image || noImage" 
                     :alt="product.name" 
                     class="w-full h-full object-cover">
              </div>
              <div class="flex-1 flex flex-col">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ product.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-mono mb-2">{{ product.barcode }}</p>
                <span class="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 self-start mb-2">
                  {{ product.category }}
                </span>
                <div class="flex items-center mb-2">
                  <span class="text-sm font-medium" :class="{
                    'text-green-600 dark:text-green-400': product.currentStock > product.minStock,
                    'text-yellow-600 dark:text-yellow-400': product.currentStock <= product.minStock && product.currentStock > 0,
                    'text-red-600 dark:text-red-400': product.currentStock === 0
                  }">
                    {{ product.currentStock }}
                  </span>
                  <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">units</span>
                </div>
                <div class="mb-4">
                  <div class="text-sm font-semibold text-gray-900 dark:text-white">Rp {{ product.regularPrice.toLocaleString() }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Buy: Rp {{ product.buyPrice.toLocaleString() }}</div>
                </div>
                <div class="flex justify-end space-x-2 mt-auto">
                  <IconButton
                    variant="primary"
                    size="sm"
                    @click="handleEditProduct(product)"
                  >
                    <template #icon>
                      <Icon name="PencilIcon" class="w-4 h-4" />
                      <!-- Barcode Scanner -->
  <BarcodeScanner
    v-if="showScanner"
    @scan-success="(result) => {
      searchQuery = result
      showScanner = false
    }"
    @scan-error="() => showScanner = false"
    @close="showScanner = false"
  />
</template>
                  </IconButton>
                  <IconButton
                    variant="danger"
                    size="sm"
                    @click="showDeleteConfirm(product)"
                  >
                    <template #icon>
                      <Icon name="TrashIcon" class="w-4 h-4" />
                      <!-- Barcode Scanner -->
  <BarcodeScanner
    v-if="showScanner"
    @scan-success="(result) => {
      searchQuery = result
      showScanner = false
    }"
    @scan-error="() => showScanner = false"
    @close="showScanner = false"
  />
</template>
                  </IconButton>
                </div>
              </div>
            </Card>
          </div>

          <!-- Table View -->
          <Card v-else padding="p-2" class="border border-gray-200 dark:border-gray-700 shadow-lg mb-16">
            <!-- Existing table code -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-dark-700">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Product</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Category</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Stock</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Price</th>
                    <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="product in getPageItems" 
                      :key="product.id"
                      class="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg shadow-sm">
                          <img :src="product.image || '/src/assets/no-image.svg'" :alt="product.name" class="h-12 w-12 object-cover transform transition-transform duration-200 hover:scale-110">
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ product.name }}</div>
                          <div class="text-sm text-gray-500 dark:text-gray-400 font-mono">{{ product.barcode }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-5 whitespace-nowrap">
                      <span class="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {{ product.category }}
                      </span>
                    </td>
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="flex items-center">
                        <span class="text-sm font-medium" :class="{
                          'text-green-600 dark:text-green-400': product.currentStock > product.minStock,
                          'text-yellow-600 dark:text-yellow-400': product.currentStock <= product.minStock && product.currentStock > 0,
                          'text-red-600 dark:text-red-400': product.currentStock === 0
                        }">
                          {{ product.currentStock }}
                        </span>
                        <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">units</span>
                      </div>
                    </td>
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="text-sm font-semibold text-gray-900 dark:text-white">Rp {{ product.regularPrice.toLocaleString() }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Buy: Rp {{ product.buyPrice.toLocaleString() }}</div>
                    </td>
                    <td class="px-6 py-5 whitespace-nowrap text-sm font-medium flex justify-end space-x-2">
                      <IconButton
                        variant="primary"
                        size="sm"
                        @click="handleEditProduct(product)"
                      >
                        <template #icon>
                          <Icon name="PencilIcon" class="w-4 h-4" />
                          <!-- Barcode Scanner -->
                          <BarcodeScanner
                            v-if="showScanner"
                            @scan-success="(result) => {
                              searchQuery = result
                              showScanner = false
                            }"
                            @scan-error="() => showScanner = false"
                            @close="showScanner = false"
                          />
                        </template>
                      </IconButton>
                      <IconButton
                        variant="danger"
                        size="sm"
                        @click="showDeleteConfirm(product)"
                      >
                        <template #icon>
                          <Icon name="TrashIcon" class="w-4 h-4" />
                          <!-- Barcode Scanner -->
                          <BarcodeScanner
                            v-if="showScanner"
                            @scan-success="(result) => {
                              searchQuery = result
                              showScanner = false
                            }"
                            @scan-error="() => showScanner = false"
                            @close="showScanner = false"
                          />
                        </template>
                      </IconButton>
                     
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>


          <!-- Pagination -->
          <div class="flex-row">
            <Card padding="p-2" class="border-t border-gray-200 dark:border-gray-700 shadow-lg">
              <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-2 bg-white dark:bg-dark-800">
                <div class="text-sm text-gray-700 dark:text-gray-300">
                  Showing
                  <span class="font-medium">{{ ((pagination.currentPage - 1) * pagination.itemsPerPage) + 1 }}</span>
                  to
                  <span class="font-medium">{{ Math.min(pagination.currentPage * pagination.itemsPerPage, filteredProducts.length) }}</span>
                  of
                  <span class="font-medium">{{ filteredProducts.length }}</span>
                  results
                </div>
                <div class="flex items-center space-x-1">
                  <button
                    @click="changePage(1)"
                    :disabled="pagination.currentPage === 1"
                    class="p-2 rounded-md bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Icon name="chevrons-left" class="w-4 h-4" />
                  </button>
                  <button
                    @click="changePage(pagination.currentPage - 1)"
                    :disabled="pagination.currentPage === 1"
                    class="p-2 rounded-md bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Icon name="chevron-left" class="w-4 h-4" />
                  </button>
                  
                  <div class="hidden sm:flex space-x-1">
                    <template v-for="page in pagination.totalPages" :key="page">
                      <button
                        v-if="page >= pagination.startPage && page <= pagination.endPage"
                        @click="changePage(page)"
                        :class="[
                          'px-3 py-1 rounded-md transition-colors duration-200',
                          pagination.currentPage === page
                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                            : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                        ]"
                      >
                        {{ page }}
                      </button>
                      <!-- Barcode Scanner -->
  <BarcodeScanner
    v-if="showScanner"
    @scan-success="(result) => {
      searchQuery = result
      showScanner = false
    }"
    @scan-error="() => showScanner = false"
    @close="showScanner = false"
  />
</template>
                  </div>

                  <button
                    @click="changePage(pagination.currentPage + 1)"
                    :disabled="pagination.currentPage >= pagination.totalPages"
                    class="p-2 rounded-md bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Icon name="chevron-right" class="w-4 h-4" />
                  </button>
                  <button
                    @click="changePage(pagination.totalPages)"
                    :disabled="pagination.currentPage >= pagination.totalPages"
                    class="p-2 rounded-md bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Icon name="chevrons-right" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
      </div>

     <!-- Product Form Modal -->
     <Modal
      v-model="showProductForm"
      :title="isEdit ? 'Edit Product' : 'Add New Product'"
      @close="showProductForm = false"
    >
      <ProductForm
        :product="selectedProduct"
        :is-edit="isEdit"
        @submit="handleProductSubmit"
        @cancel="handleProductCancel"
      />
    </Modal>

    <!-- Batch Operations Modal -->
    <BatchOperationsModal
      v-model="showBatchOperations"
      @close="showBatchOperations = false"
    />
     <!-- Delete Confirmation Modal -->
     <Modal
        v-model="productStore.showDeleteConfirm"
        title="Confirm Delete"
        @close="productStore.showDeleteConfirm = false"
      >
        <div class="p-6">
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to delete this product?
            <span class="font-semibold">{{ selectedProduct?.name }}</span>?
            This action cannot be undone.
          </p>
          <div class="flex justify-end space-x-4">
            <button
              @click="productStore.showDeleteConfirm = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-dark-700 dark:text-gray-300 dark:hover:bg-dark-600"
            >
              Cancel
            </button>
            <button
              @click="confirmDelete"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

    <!-- Batch Operations Modal -->
    <BatchOperationsModal
      v-model="showBatchOperations"
      @close="showBatchOperations = false"
    />
    
  </div>
  <!-- Barcode Scanner -->
  <BarcodeScanner
    v-if="showScanner"
    @scan-success="(result) => {
      searchQuery = result
      showScanner = false
    }"
    @scan-error="() => showScanner = false"
    @close="showScanner = false"
  />
</template>