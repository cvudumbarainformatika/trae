<script setup>
import { computed, onMounted, watch } from 'vue'
import { useProductStore } from '@/stores/admin/product'
import { useProductFormStore } from '@/stores/forms/productForm'
import { useSatuanStore } from '@/stores/admin/satuan'
import ProductForm from '@/components/admin/products/ProductForm.vue'
import BarcodeScanner from '@/components/admin/BarcodeScanner.vue'
import ProductCard from '@/components/admin/products/ProductCard.vue'
import ProductTable from '@/components/admin/products/ProductTable.vue'
import { useCategoryStore } from '@/stores/admin/category'
import { useNotification } from '@/composables/useNotification'

// Store initialization
const productStore = useProductStore()
const form = useProductFormStore()
const satuanStore = useSatuanStore()
const categoryStore = useCategoryStore()

onMounted(() => {
  Promise.all([
    satuanStore.fetchSatuans(),
    productStore.resetFilters(),
    categoryStore.fetchCategories(),
    productStore.fetchProducts()
  ])
})

// Computed properties from store
const viewMode = computed(() => productStore.viewMode)
const isEdit = computed(() => productStore.isEdit)
const showProductForm = computed({
  get: () => productStore.showProductForm,
  set: (value) => productStore.setShowProductForm(value)
})
const searchQuery = computed({
  get: () => productStore.filters.q,
  set: (value) => productStore.setSearchQuery(value)
})
const showFilters = computed({
  get: () => productStore.showFilters,
  set: (value) => productStore.setShowFilters(value)
})
const filters = computed(() => productStore.filters)
const categories = computed(() => productStore.categories)
const satuans = computed(() => productStore.satuans)
const pagination = computed(() => productStore.paginationInfo)
const currentPage = computed({
  get: () => productStore.pagination.currentPage,
  set: (value) => productStore.setCurrentPage(value)
})
const getPageItems = computed(() => productStore.products)

// Add missing computed properties

const showScanner = computed({
  get: () => productStore.showScanner,
  set: (value) => productStore.showScanner = value
})

const selectedProduct = computed(() => productStore.selectedProduct)

// Event handlers
const handleEditProduct = (product) => {
  productStore.selectedProduct = product
  productStore.setEdit(true)
  form.resetForm()
  productStore.showProductForm = true
}
const handleAddProduct = () => {
  productStore.selectedProduct = null
  productStore.setEdit(false)
  form.resetForm()
  productStore.showProductForm = true
}

const showDeleteConfirm = (product) => {
  productStore.selectedProduct = product
  productStore.showDeleteConfirm = true
}

const confirmDelete = async () => {
  await productStore.deleteProduct(productStore.selectedProduct.id)
  productStore.showDeleteConfirm = false
}


const handleProductCancel = () => {
  productStore.showProductForm = false
  productStore.selectedProduct = null
  productStore.isEdit = false
}

const resetFilters = () => {
  productStore.resetFilters()
}

const setViewMode = (mode) => {
  productStore.viewMode = mode
}
</script>

<template>
  <BasePage title="Product Management">

    <!-- Filters and Search Section -->
    <div class="flex-1 flex overflow-hidden w-full space-y-4 relative">
      <div class="flex flex-col h-full w-full space-y-4">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex flex-wrap items-center gap-2">
            <IconButton data-filter-toggle @click="showFilters = !showFilters" variant="ghost" size="md"
              class="flex items-center space-x-2" tooltip="Filters" tooltip-position="bottom">
              <template #icon>
                <Icon name="filter" class="w-4 h-4" />
              </template>
              <span class="hidden sm:inline">Filters</span>
              <span
                v-if="filters.category || filters.priceRange.min || filters.priceRange.max || filters.stockLevel.min || filters.stockLevel.max || filters.status !== 'all'"
                class="ml-2 px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full">
                Active
              </span>
            </IconButton>
            <IconButton
              v-if="filters.category || filters.priceRange.min || filters.priceRange.max || filters.stockLevel.min || filters.stockLevel.max || filters.status !== 'all'"
              @click="resetFilters" variant="danger" mode="solid" size="md">
              <template #icon>
                <Icon name="XCircle" class="w-4 h-4" />
              </template>
              <span class="hidden sm:inline">Reset</span>
            </IconButton>
          </div>

          <div class="flex flex-wrap items-center gap-2 bg-white dark:bg-dark-800 rounded-lg p-1">
            <IconButton variant="info" size="md" @click="handleAddProduct" class="sm:w-auto">
              <template #icon>
                <Icon name="Plus" class="w-5 h-5" />
              </template>
              <span class="hidden sm:inline ml-2">Add</span>
            </IconButton>
            <IconButton variant="info" size="md" @click="showScanner = true" class="sm:w-auto">
              <template #icon>
                <Icon name="Scan" class="w-5 h-5" />
              </template>
              <span class="hidden sm:inline ml-2">Scan</span>
            </IconButton>
            <IconButton @click="setViewMode('grid')" :variant="viewMode === 'grid' ? 'primary' : 'ghost'" size="md"
              class="sm:w-auto">
              <template #icon>
                <Icon name="LayoutGrid" class="w-5 h-5" />
              </template>
            </IconButton>
            <IconButton @click="setViewMode('table')" :variant="viewMode === 'table' ? 'primary' : 'ghost'" size="md"
              class="sm:w-auto">
              <template #icon>
                <Icon name="Table" class="w-5 h-5" />
              </template>
            </IconButton>
          </div>

          <div class="w-full sm:flex-1 relative">
            <!-- <BaseInput
              :modelValue="searchQuery"
              placeholder="Search products..."
              type="text"
              class="w-full"
              clearable
              @keydown.enter="(e)=> {
                searchQuery = e.target.value
              }"
              @clear="searchQuery = ''"
            >
            </BaseInput> -->
            <BaseInput v-model="searchQuery" placeholder="Search products..." type="text" class="w-full" clearable
              :debounce="300">
            </BaseInput>
          </div>
        </div>

        <transition enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4">
          <div v-if="showFilters" ref="filterRef" class="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6"
            @click.self="showFilters = false">
            <div class="w-full max-w-lg relative">
              <div class="fixed inset-0 bg-black/50" @click="showFilters = false"></div>
              <div
                class="relative z-[60] bg-white dark:bg-dark-800 rounded-lg shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6 transform transition-all duration-300 ease-out"
                @click.stop>
                <!-- Close Button -->
                <button @click="showFilters = false"
                  class="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
                  <Icon name="X" class="w-5 h-5" />
                </button>

                <!-- Filter Content -->
                <div class="pt-6">
                  <!-- Category Filter -->
                  <div class="space-y-2 mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <BaseSelect v-model="filters.category_id"
                      :options="[{ label: 'All Categories', value: '' }, ...categories?.map(cat => ({ label: cat?.name, value: cat?.id }))]"
                      options-label="label" options-value="value" placeholder="Select Category" class="w-full" clearable
                      @update:model-value="(val) => productStore.setFilter('category_id', val)" />
                  </div>

                  <!-- Satuan Filter -->
                  <div class="space-y-2 mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Satuan</label>
                    <BaseSelect v-model="filters.satuan_id"
                      :options="[{ label: 'All Satuans', value: '' }, ...satuans?.map(sat => ({ label: sat?.name, value: sat?.id }))]"
                      options-label="label" options-value="value" placeholder="Pilih Satuan" class="w-full" clearable
                      @update:model-value="(val) => productStore.setFilter('satuan_id', val)" />
                  </div>

                  <!-- Status Filter -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button v-for="status in ['all', 'in-stock', 'low-stock', 'out-of-stock']" :key="status"
                        @click="productStore.setFilter('status', status)" :class="[
                          'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 w-full',
                          filters.status === status
                            ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                            : 'bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                        ]">
                        {{ status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Products Content -->
        <div class="flex-1 overflow-auto relative ">
          <!-- Grid View -->
          <div v-if="viewMode === 'grid'"
            class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-16">
            <template v-if="getPageItems?.length > 0">
              <ProductCard v-for="(product, i) in getPageItems" :key="product?.id" :product="product"
                :search-query="searchQuery" v-html-safe="{
                  data: {
                    name: product.name,
                    barcode: product.barcode,
                    'category.name': product.category?.name
                  },
                  fields: ['name', 'barcode', 'category.name'],
                  searchQuery: searchQuery || ''
                }" @edit="handleEditProduct" @delete="showDeleteConfirm" />
            </template>
            <template v-else-if="productStore.loading">
              <div v-for="n in 8" :key="n" class="animate-pulse">
                <div class="bg-gray-200 dark:bg-dark-700 rounded-lg h-[300px] flex flex-col">
                  <div class="h-48 bg-gray-300 dark:bg-dark-600 rounded-t-lg"></div>
                  <div class="p-4 space-y-3">
                    <div class="h-4 bg-gray-300 dark:bg-dark-600 rounded w-3/4"></div>
                    <div class="h-4 bg-gray-300 dark:bg-dark-600 rounded w-1/2"></div>
                    <div class="h-4 bg-gray-300 dark:bg-dark-600 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            </template>
            <NoData v-else title="Belum Ada Data Product" description="Tidak ditemukan data pada system kami"
              icon="Package" action-label="Add Product" @action="showProductForm = true" class="col-span-full" />
          </div>

          <!-- Table View -->
          <div v-else class="w-full">
            <template v-if="getPageItems?.length > 0">
              <ProductTable :products="getPageItems" :search-query="searchQuery" @edit="handleEditProduct"
                @delete="showDeleteConfirm" />
            </template>
            <NoData v-else title="Belum Ada Data Product" description="Tidak ditemukan data pada system kami"
              icon="Package" action-label="Add Product" @action="showProductForm = true" />

          </div>
        </div>

        <!-- Pagination -->
        <div v-if="getPageItems?.length" class="flex-row">
          <BasePagination v-model:currentPage="currentPage" :total-items="pagination?.totalItems"
            :items-per-page="pagination.itemsPerPage" :max-visible-pages="pagination.maxVisiblePages"
            @update:currentPage="(val) => productStore.handlePage(val)" />
        </div>

      </div>
    </div>
    <!-- Product Form Modal -->
    <Modal v-model="showProductForm" :title="isEdit ? 'Edit Product' : 'Add New Product'"
      @close="showProductForm = false">
      <ProductForm :product="selectedProduct" :is-edit="isEdit" @cancel="handleProductCancel" />
    </Modal>


    <!-- Delete Confirmation Modal -->
    <Modal v-model="productStore.showDeleteConfirm" title="Confirm Delete"
      @close="productStore.showDeleteConfirm = false">
      <div class="p-6">
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Benar akan Menghapus product ini?
          <span class="font-semibold text-primary-300 dark:text-primary-300">{{ selectedProduct?.name }}</span>?
          Product ini akan terhapus dari Master.
        </p>
        <div class="flex justify-end space-x-4">
          <!-- <IconButton
            @click="productStore.showDeleteConfirm = false"
            variant="danger"
            size="md"
          >
            <span>Cancel</span>
          </IconButton> -->

          <base-button label="Cancel" variant="ghost" @click="productStore.showDeleteConfirm = false" />
          <base-button label="Hapus !" variant="danger" @click="confirmDelete" />


          <!-- <IconButton
            @click="confirmDelete"
            variant="danger"
            size="md"
          >
            <span>Delete</span>
          </IconButton> -->
        </div>
      </div>
    </Modal>

    <!-- Barcode Scanner -->
    <BarcodeScanner v-if="showScanner" @scan-success="(result) => {
      searchQuery = result
      showScanner = false
    }" @scan-error="() => showScanner = false" @close="showScanner = false" />
  </BasePage>

</template>

<style scoped>
:deep(.highlight) {
  @apply bg-yellow-200 dark:bg-yellow-600 rounded;
}
</style>
