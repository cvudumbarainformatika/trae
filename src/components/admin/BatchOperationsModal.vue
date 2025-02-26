<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/admin/product'

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
    <div class="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-800 dark:to-dark-900 rounded-lg shadow-inner">
      <!-- Operation Type -->
      <div class="space-y-2">
        <BaseSelect
          v-model="operationType"
          label="Jenis Operasi"
          clearable
          :options="[
            { value: 'price', label: 'Sesuaikan Harga' },
            { value: 'stock', label: 'Perbarui Stok' }
          ]"
        />
      </div>

      <!-- Price Validation Toggle -->
      <div v-if="operationType === 'price'" class="flex items-center p-4 space-x-3 bg-gray-100 dark:bg-dark-700 rounded-lg transition-all duration-300 hover:bg-gray-200 dark:hover:bg-dark-600">
        <input
          type="checkbox"
          id="priceValidation"
          v-model="showPriceValidation"
          class="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-lg transition-colors duration-200"
        >
        <label for="priceValidation" class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tampilkan produk dengan harga jual di bawah harga beli
        </label>
      </div>

      <!-- Price Validation Summary -->
      <Card v-if="showPriceValidation" class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
        <div class="space-y-2 p-4">
          <p class="text-sm text-red-700 dark:text-red-400 space-y-1">
            <span class="block">Ditemukan:</span>
            <span class="block ml-4">
              <span class="font-medium">{{ productsWithInvalidRegularPrice.length }}</span> produk dengan harga reguler di bawah harga beli
            </span>
            <span class="block ml-4">
              <span class="font-medium">{{ productsWithInvalidCustomerPrice.length }}</span> produk dengan harga pelanggan di bawah harga beli
            </span>
            <span class="block ml-4">
              <span class="font-medium">{{ productsWithInvalidWholesalePrice.length }}</span> produk dengan harga grosir di bawah harga beli
            </span>
          </p>
        </div>
      </Card>

      <!-- Adjustment Type -->
      <div class="space-y-2">
        <BaseSelect
          v-model="adjustmentType"
          label="Jenis Penyesuaian"
          clearable
          :options="[
            { value: 'percentage', label: 'Persentase (%)' },
            { value: 'fixed', label: 'Nominal (Rp)' }
          ]"
        />
      </div>

      <!-- Adjustment Value -->
      <div class="space-y-2">
        <BaseInput
          v-model="adjustmentValue"
          type="number"
          :label="adjustmentType === 'percentage' ? 'Persentase Penyesuaian' : 'Nominal Penyesuaian'"
          :placeholder="adjustmentType === 'percentage' ? 'Contoh: 10 untuk menaikkan 10%' : 'Masukkan nominal dalam Rupiah'"
        >
          <template #suffix>
            <span class="text-gray-500 dark:text-gray-400">{{ adjustmentType === 'percentage' ? '%' : 'Rp' }}</span>
          </template>
        </BaseInput>
      </div>

      <!-- Category Filter -->
      <div class="space-y-2">
        <BaseSelect
          v-model="selectedCategory"
          label="Filter berdasarkan Kategori"
          clearable
          :options="[{ value: '', label: 'Semua Kategori' }, ...categories.map(c => ({ value: c?.id, label: c?.name }))]">
        </BaseSelect>
      </div>

      <!-- Preview Changes -->
      <div v-if="previewChanges.length > 0" class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
          <span>Pratinjau Perubahan</span>
          <span class="text-sm text-primary-600 dark:text-primary-400">({{ previewChanges.length }} item)</span>
        </h3>
        <div class="max-h-60 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-dark-700 sticky top-0 z-10">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produk</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Saat Ini</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Baru</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="change in previewChanges" :key="change.id" class="hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-150">
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
    <div class="bg-gray-50 dark:bg-dark-700 px-6 py-4 flex justify-end space-x-3 rounded-b-lg border-t border-gray-200 dark:border-gray-600">
      <button
        @click="close"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
      >
        Batal
      </button>
      <button
        @click="applyChanges"
        :disabled="previewChanges.length === 0"
        class="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        Terapkan Perubahan
      </button>
    </div>
  </Modal>
</template>