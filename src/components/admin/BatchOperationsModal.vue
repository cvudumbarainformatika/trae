<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '../../stores/admin/product'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const productStore = useProductStore()

const operationType = ref('price')
const adjustmentType = ref('percentage')
const adjustmentValue = ref(0)
const selectedCategory = ref('')
const selectedProducts = ref([])
const showPriceValidation = ref(false)

// Price validation computed properties
const productsWithInvalidRegularPrice = computed(() => 
  productStore.products.filter(p => p.regularPrice < p.buyingPrice)
)

const productsWithInvalidCustomerPrice = computed(() => 
  productStore.products.filter(p => p.customerPrice < p.buyingPrice)
)

const productsWithInvalidWholesalePrice = computed(() => 
  productStore.products.filter(p => p.wholesalePrice < p.buyingPrice)
)

const categories = computed(() => {
  return [...new Set(productStore.products.map(p => p.category))]
})

const previewChanges = computed(() => {
  if (showPriceValidation.value) {
    const invalidProducts = new Set([
      ...productsWithInvalidRegularPrice.value,
      ...productsWithInvalidCustomerPrice.value,
      ...productsWithInvalidWholesalePrice.value
    ])
    
    return Array.from(invalidProducts).map(product => ({
      id: product.id,
      name: product.name,
      original: product,
      updated: { ...product }
    }))
  }
  
  if (!adjustmentValue.value) return []

  return productStore.products.map(product => {
    const newProduct = { ...product }
    
    if (operationType.value === 'price') {
      if (adjustmentType.value === 'percentage') {
        const percentage = adjustmentValue.value / 100
        newProduct.regularPrice = Math.round(product.regularPrice * (1 + percentage))
        newProduct.customerPrice = Math.round(product.customerPrice * (1 + percentage))
        newProduct.wholesalePrice = Math.round(product.wholesalePrice * (1 + percentage))
      } else {
        newProduct.regularPrice = product.regularPrice + adjustmentValue.value
        newProduct.customerPrice = product.customerPrice + adjustmentValue.value
        newProduct.wholesalePrice = product.wholesalePrice + adjustmentValue.value
      }
    } else if (operationType.value === 'stock') {
      if (adjustmentType.value === 'percentage') {
        const percentage = adjustmentValue.value / 100
        newProduct.initialStock = Math.round(product.initialStock * (1 + percentage))
        newProduct.currentStock = Math.round(product.currentStock * (1 + percentage))
      } else {
        newProduct.initialStock = product.initialStock + adjustmentValue.value
        newProduct.currentStock = product.currentStock + adjustmentValue.value
      }
    }

    return {
      id: product.id,
      name: product.name,
      original: product,
      updated: newProduct
    }
  }).filter(change => {
    if (selectedCategory.value && change.original.category !== selectedCategory.value) {
      return false
    }
    return JSON.stringify(change.original) !== JSON.stringify(change.updated)
  })
})

const applyChanges = () => {
  previewChanges.value.forEach(change => {
    productStore.updateProduct(change.updated)
  })
  emit('close')
}

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <Modal
    :model-value="modelValue"
    title="Batch Operations"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="close"
  >
    <div class="p-6 space-y-6">
      <!-- Operation Type -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Operation Type</label>
        <select
          v-model="operationType"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-dark-700 dark:text-white"
        >
          <option value="price">Adjust Prices</option>
          <option value="stock">Update Stock</option>
        </select>
      </div>

      <!-- Price Validation Toggle -->
      <div class="flex items-center space-x-2" v-if="operationType === 'price'">
        <input
          type="checkbox"
          id="priceValidation"
          v-model="showPriceValidation"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        >
        <label for="priceValidation" class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Show products with selling price below buying price
        </label>
      </div>

      <!-- Price Validation Summary -->
      <div v-if="showPriceValidation" class="space-y-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
        <p class="text-sm text-red-700 dark:text-red-400">
          Found:
          <span class="font-medium">{{ productsWithInvalidRegularPrice.length }}</span> products with regular price below buying price
          <br>
          <span class="font-medium">{{ productsWithInvalidCustomerPrice.length }}</span> products with customer price below buying price
          <br>
          <span class="font-medium">{{ productsWithInvalidWholesalePrice.length }}</span> products with wholesale price below buying price
        </p>
      </div>

      <!-- Adjustment Type -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Adjustment Type</label>
        <select
          v-model="adjustmentType"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-dark-700 dark:text-white"
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
      </div>

      <!-- Adjustment Value -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Adjustment Value</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            v-model.number="adjustmentValue"
            :placeholder="adjustmentType === 'percentage' ? 'Enter percentage' : 'Enter amount'"
            class="block w-full pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-dark-700 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          >
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span class="text-gray-500 sm:text-sm" v-if="adjustmentType === 'percentage'">%</span>
            <span class="text-gray-500 sm:text-sm" v-else>Rp</span>
          </div>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Category</label>
        <select
          v-model="selectedCategory"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-dark-700 dark:text-white"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <!-- Preview Changes -->
      <div v-if="previewChanges.length > 0" class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Preview Changes</h3>
        <div class="max-h-60 overflow-y-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">New</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="change in previewChanges" :key="change.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ change.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <template v-if="operationType === 'price'">
                    Rp {{ change.original.regularPrice.toLocaleString() }}
                  </template>
                  <template v-else>
                    {{ change.original.currentStock }}
                  </template>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <template v-if="operationType === 'price'">
                    Rp {{ change.updated.regularPrice.toLocaleString() }}
                  </template>
                  <template v-else>
                    {{ change.updated.currentStock }}
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Footer -->
    <div class="bg-gray-50 dark:bg-dark-700 px-6 py-3 flex justify-end space-x-3">
      <button
        @click="close"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Cancel
      </button>
      <button
        @click="applyChanges"
        :disabled="previewChanges.length === 0"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Apply Changes
      </button>
    </div>
  </Modal>
</template>