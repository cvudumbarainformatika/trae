<template>
  <div class="space-y-4">
    <!-- Supplier Search Card -->
    <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
      <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
        <Icon name="User" class="mr-2 text-primary-500" /> Informasi Supplier
      </h3>

      <!-- Supplier Search -->
      <div class="relative mb-4">
        <SearchDropdown
          v-model="supplierSearchModel"
          placeholder="Cari supplier..."
          :debounce="300"
          :min-search-length="3"
          item-key="id"
          item-label="name"
          not-found-text="Supplier tidak ditemukan"
          not-found-subtext="Coba kata kunci lain atau tambahkan supplier baru"
          add-button-text="Tambah Supplier Baru"
          api-url="/api/v1/suppliers"
          api-response-path="data.data"
          :use-api="true"
          @select="selectSupplier"
          @add-new="openAddSupplierDialog"
          @items-loaded="onSuppliersLoaded"
        >
          <template #item="{ item }">
            <div class="font-medium text-secondary-900 dark:text-white">{{ item.name }}</div>
            <div class="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-2">
              <span>{{ item.phone || 'Tidak ada telepon' }}</span>
            </div>
          </template>
        </SearchDropdown>
      </div>

      <!-- Selected Supplier Card -->
      <!-- <div v-if="supplierId"
           class="p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg border-l-4 border-primary-500 animate-fadeIn">
        <div class="flex justify-between items-start">
          <div>
            <div class="font-medium text-secondary-900 dark:text-white">
              {{ selectedSupplierDetails?.name }}
            </div>
            <div class="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
              {{ selectedSupplierDetails?.address || 'Tidak ada alamat' }}
            </div>
          </div>
          <button @click="clearSelectedSupplier"
                  class="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300">
            <i class="ri-close-line"></i>
          </button>
        </div>
      </div> -->
    </div>

    <!-- Ganti Dates Card dengan Supplier Info Card saat draft -->
    <div v-if="supplierId && status === 'draft'"
         class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
      <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
        <Icon name="User" class="mr-2 text-primary-500" /> Detail Supplier
      </h3>

      <div class="space-y-3">
        <div class="flex flex-col">
          <span class="text-sm text-secondary-500 dark:text-secondary-400">Perusahaan</span>
          <span class="font-medium text-secondary-900 dark:text-white">{{ selectedSupplierDetails?.name }}</span>
        </div>

        <div class="flex flex-col">
          <span class="text-sm text-secondary-500 dark:text-secondary-400">Kontak</span>
          <span class="font-medium text-secondary-900 dark:text-white">{{ selectedSupplierDetails?.phone || 'Tidak ada telepon' }}</span>
        </div>

        <div class="flex flex-col">
          <span class="text-sm text-secondary-500 dark:text-secondary-400">Email</span>
          <span class="font-medium text-secondary-900 dark:text-white">{{ selectedSupplierDetails?.email || 'Tidak ada email' }}</span>
        </div>
      </div>
    </div>

    <!-- Tampilkan placeholder card jika belum ada supplier -->
    <div v-if="!supplierId && status === 'draft'"
         class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
      <div class="flex flex-col items-center justify-center py-6 text-center">
        <Icon name="UserSearch" class="w-12 h-12 text-primary-400 mb-3" />
        <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-2">Belum Ada Supplier</h3>
        <p class="text-secondary-500 dark:text-secondary-400 text-sm max-w-md">
          Silakan cari dan pilih supplier di atas untuk melanjutkan order pembelian Anda
        </p>
      </div>
    </div>

    <!-- Tampilkan Order Dates jika status bukan draft -->
    <div v-if="status !== 'draft'"
         class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
      <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
        <i class="ri-calendar-line mr-2 text-primary-500"></i> Tanggal Order
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseDatePicker
          v-model="dateModel"
          label="Tanggal Order"
          required
        />

        <BaseDatePicker
          v-model="dueDateModel"
          label="Jatuh Tempo"
          required
          :min="dateModel"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Icon from '@/components/ui/Icon.vue'
import BaseDatePicker from '@/components/ui/BaseDatePicker.vue'
import SearchDropdown from '@/components/ui/SearchDropdown.vue'

const props = defineProps({
  supplierId: {
    type: [Number, String],
    default: null
  },
  status: {
    type: String,
    default: 'draft'
  },
  suppliers: {
    type: Array,
    default: () => []
  },
  supplierSearch: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: ''
  },
  dueDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:supplierId', 'update:supplierSearch', 'update:date', 'update:dueDate', 'add-supplier', 'suppliers-loaded'])

// State untuk menyimpan detail supplier yang dipilih
const selectedSupplierDetails = ref(null)

// Computed properties for v-model binding
const supplierSearchModel = computed({
  get: () => props.supplierSearch,
  set: (value) => emit('update:supplierSearch', value)
})

const dateModel = computed({
  get: () => props.date,
  set: (value) => emit('update:date', value)
})

const dueDateModel = computed({
  get: () => props.dueDate,
  set: (value) => emit('update:dueDate', value)
})



// Methods
const selectSupplier = (supplier) => {
  // Simpan supplier lengkap ke state lokal agar tidak perlu query lagi
  selectedSupplierDetails.value = supplier
  emit('update:supplierId', supplier.id)
  emit('update:supplierSearch', '')
}

const clearSelectedSupplier = () => {
  emit('update:supplierId', null)
}

const openAddSupplierDialog = () => {
  emit('add-supplier')
}

const onSuppliersLoaded = (suppliers) => {
  emit('suppliers-loaded', suppliers)
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
</style>
