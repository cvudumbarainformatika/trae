<template>
  <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
    <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
      <i class="ri-information-line mr-2 text-primary-500"></i> Informasi Pembelian
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Purchase Order Info -->
      <div v-if="purchaseOrderId" class="border-b pb-4 md:border-b-0 md:pb-0 md:border-r md:pr-4 dark:border-secondary-700">
        <div class="flex justify-between items-start">
          <div>
            <h4 class="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Purchase Order
            </h4>
            <p class="text-secondary-900 dark:text-white">
              {{ purchaseOrderId ? `#${purchaseOrderId}` : 'Tidak ada' }}
            </p>
            <p class="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
              {{ purchaseOrderData ? `Dibuat pada ${formatDate(purchaseOrderData.created_at)}` : '' }}
            </p>
          </div>
          <button
            @click="$emit('clear-po')"
            class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
            title="Hapus relasi dengan PO"
          >
            <i class="ri-close-circle-line text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Invoice Number -->
      <div>
        <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
          Nomor Faktur <span class="text-red-500">*</span>
        </label>
        <input
          v-model="invoiceNumberModel"
          type="text"
          placeholder="Masukkan nomor faktur"
          class="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
          required
        />
      </div>
    </div>

    <!-- Debug info -->
    <div v-if="import.meta.env.DEV" class="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
      <p>Debug: PO ID = {{ purchaseOrderId }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  invoiceNumber: {
    type: String,
    default: ''
  },
  purchaseOrderId: {
    type: [Number, String],
    default: null
  },
  purchaseOrderData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:invoiceNumber', 'clear-po'])

// Computed properties
const invoiceNumberModel = computed({
  get: () => props.invoiceNumber,
  set: (value) => emit('update:invoiceNumber', value)
})

// Methods
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date)
}
</script>
