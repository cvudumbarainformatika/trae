<script setup>
import { computed, ref, watch } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { useProductStore } from '../../stores/admin/product'
import ProductForm from '../../components/admin/ProductForm.vue'
import BarcodeScanner from '../../components/admin/BarcodeScanner.vue'
import BatchOperationsModal from '../../components/admin/BatchOperationsModal.vue'
import ProductCard from '../../components/admin/products/ProductCard.vue'
import ProductTable from '../../components/admin/products/ProductTable.vue'
import ProductFilters from '../../components/admin/products/ProductFilters.vue'
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

// Delete confirmation handler
const confirmDelete = () => {
  if (selectedProduct.value) {
    productStore.deleteProduct(selectedProduct.value.id)
    productStore.showDeleteConfirm = false
    selectedProduct.value = null
  }
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
    <div class="flex-1 flex overflow-hidden w-full space-y-4 relative">
      <div class="flex flex-col h-full w-full space-y-4">
        <div class="flex items-center space-x-4">
          <IconButton
            data-filter-toggle
            @click="showFilters = !showFilters"
            variant="ghost"
            size="md"
            class="flex items-center space-x-2"
          >
            <template #icon>
              <Icon name="filter" class="w-4 h-4" />
            </template>
            <span>Filters</span>
            <span v-if="filters.category || filters.priceRange.min || filters.priceRange.max || filters.stockLevel.min || filters.stockLevel.max || filters.status !== 'all'" 
              class="ml-2 px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full"
            >
              Active
            </span>
          </IconButton>
          <IconButton
            v-if="filters.category || filters.priceRange.min || filters.priceRange.max || filters.stockLevel.min || filters.stockLevel.max || filters.status !== 'all'"
            @click="resetFilters"
            variant="ghost"
            size="md"
          >
            <template #icon>
              <Icon name="XCircle" class="w-4 h-4" />
            </template>
            <span>Reset</span>
          </IconButton>
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
              </template>
            </IconButton>
            <IconButton
              @click="setViewMode('grid')"
              :variant="viewMode === 'grid' ? 'primary' : 'ghost'"
              size="md"
            >
              <template #icon>
                <Icon name="LayoutGrid" class="w-5 h-5" />
              </template>
            </IconButton>
            <IconButton
              @click="setViewMode('table')"
              :variant="viewMode === 'table' ? 'primary' : 'ghost'"
              size="md"
            >
              <template #icon>
                <Icon name="Table" class="w-5 h-5" />
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
            class="absolute inset-0 z-50 overflow-hidden top-0 left-0"
            @click.self="showFilters = false"
          >
            <div class="">
              <div
                class="absolute top-8 left-0 bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 space-y-6 max-w-lg w-full transform transition-all duration-300 ease-out"
                @click.stop
              >
                <!-- Close Button -->
                <button
                  @click="showFilters = false"
                  class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                >
                  <Icon name="X" class="w-5 h-5" />
                </button>
                <!-- Category Filter -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                  <BaseSelect
                    v-model="filters.category"
                    :options="[{ label: 'All Categories', value: '' }, ...categories.map(cat => ({ label: cat, value: cat }))]" 
                    placeholder="Select Category"
                  />
                </div>

                <!-- Price Range Filter -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Price Range</label>
                  <div class="grid grid-cols-2 gap-4">
                    <BaseInput
                      v-model.number="filters.priceRange.min"
                      type="number"
                      placeholder="Min Price"
                    />
                    <BaseInput
                      v-model.number="filters.priceRange.max"
                      type="number"
                      placeholder="Max Price"
                    />
                  </div>
                </div>

                <!-- Stock Level Filter -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Level</label>
                  <div class="grid grid-cols-2 gap-4">
                    <BaseInput
                      v-model.number="filters.stockLevel.min"
                      type="number"
                      placeholder="Min Stock"
                    />
                    <BaseInput
                      v-model.number="filters.stockLevel.max"
                      type="number"
                      placeholder="Max Stock"
                    />
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
            </div>
          </div>
        </transition>

        <!-- Products Content -->
        <div class="flex-1 overflow-y-scroll relative ">
          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
            <ProductCard
              v-for="product in getPageItems"
              :key="product.id"
              :product="product"
              @edit="handleEditProduct"
              @delete="showDeleteConfirm"
            />
          </div>

          <!-- Table View -->
          <ProductTable
            v-else
            :products="getPageItems"
            @edit="handleEditProduct"
            @delete="showDeleteConfirm"
          />


          
        </div>

        <!-- Pagination -->
        <div class="flex-row">
          <BasePagination
            v-model:currentPage="currentPage"
            :total-items="filteredProducts.length"
            :items-per-page="pagination.itemsPerPage"
            :max-visible-pages="5"
          />
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
          <IconButton
            @click="productStore.showDeleteConfirm = false"
            variant="ghost"
            size="md"
          >
            <span>Cancel</span>
          </IconButton>
          <IconButton
            @click="confirmDelete"
            variant="danger"
            size="md"
          >
            <span>Delete</span>
          </IconButton>
        </div>
      </div>
    </Modal>

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
  </div>
</template>