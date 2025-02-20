<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { defineAsyncComponent } from 'vue'
import ProductForm from '../../components/admin/ProductForm.vue'

// Store initialization
const themeStore = useThemeStore()

// View mode state
const viewMode = ref('grid') // 'grid' or 'table'

// Modal state
const showProductForm = ref(false)

// Filter states
const filters = ref({
  category: '',
  minStock: null,
  maxStock: null,
  minPrice: null,
  maxPrice: null,
  unit: ''
})

// Sort state
const sortBy = ref({
  field: 'name',
  direction: 'asc'
})

// Pagination state
const pagination = ref({
  currentPage: 1,
  itemsPerPage: 12,
  total: 0
})

// Search query
const searchQuery = ref('')

// Mock products data (to be replaced with actual API calls)
const products = ref([
  {
    id: 1,
    barcode: '890123456789',
    name: 'Product 1',
    unit: 'pcs',
    category: 'Electronics',
    buyPrice: 100000,
    regularPrice: 150000,
    customerPrice: 140000,
    wholesalePrice: 130000,
    initialStock: 100,
    currentStock: 85,
    minStock: 10,
    rack: 'A-1',
    image: '/placeholder.jpg'
  },
  // Add more mock products as needed
])

// Computed properties for filtered and sorted products
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    if (!searchQuery.value) return true
    
    const query = searchQuery.value.toLowerCase()
    return (
      product.name.toLowerCase().includes(query) ||
      product.barcode.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    )
  })
})

// Handle form submission
const handleProductSubmit = (productData) => {
  // Here you would typically make an API call to save the product
  console.log('New product data:', productData)
  products.value.push({
    id: products.value.length + 1,
    ...productData,
    currentStock: productData.initialStock
  })
  showProductForm.value = false
}

// Handle form cancellation
const handleProductCancel = () => {
  showProductForm.value = false
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">Product Management</h1>
      <div class="flex space-x-4">
        <!-- View Toggle -->
        <div class="flex items-center space-x-2 bg-white dark:bg-dark-800 rounded-lg ">
          <IconButton
            @click="viewMode = 'grid'"
            :variant="viewMode === 'grid' ? 'primary' : 'ghost'"
            size="md"
          >
            <template #icon>
              <LayoutGrid class="w-5 h-5" />
            </template>
          </IconButton>
          <IconButton
            @click="viewMode = 'table'"
            :variant="viewMode === 'table' ? 'primary' : 'ghost'"
            size="md"
          >
            <template #icon>
              <Table class="w-5 h-5" />
            </template>
          </IconButton>
        </div>

        <!-- Add Product Button -->
        <IconButton 
          variant="primary" 
          size="md"
          @click="showProductForm = true"
        >
          <template #icon>
            <Plus class="w-5 h-5" />
          </template>
        </IconButton>
      </div>
    </div>

    <!-- Product Form Modal -->
    <Modal
      v-if="showProductForm"
      title="Add New Product"
      @close="showProductForm = false"
    >
      <ProductForm
        @submit="handleProductSubmit"
        @cancel="handleProductCancel"
      />
    </Modal>

    <!-- Filters and Search Section -->
    <Card>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <!-- Search Input -->
          <div class="flex-1">
            <BaseInput
              v-model="searchQuery"
              placeholder="Search products..."
              type="text"
            />
          </div>
        </div>
      </div>
    </Card>

    <!-- Products Table -->
    <Card>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-dark-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="product in filteredProducts" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img :src="product.image" :alt="product.name" class="h-10 w-10 rounded-full object-cover">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ product.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ product.barcode }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ product.category }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ product.currentStock }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Rp {{ product.regularPrice.toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3">Edit</button>
                <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Pagination -->
    <Card>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-sm text-gray-700 dark:text-gray-300">
            Showing
            <span class="font-medium">1</span>
            to
            <span class="font-medium">10</span>
            of
            <span class="font-medium">{{ filteredProducts.length }}</span>
            results
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <button
            class="px-3 py-1 rounded-md bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 disabled:opacity-50"
            :disabled="pagination.currentPage === 1"
          >
            Previous
          </button>
          <button
            class="px-3 py-1 rounded-md bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </Card>
  </div>
</template>