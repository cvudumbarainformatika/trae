<template>
  <div class="space-y-4">
    <!-- Supplier Search Card -->
    <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
      <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
        <Icon name="User" class="mr-2 text-primary-500" /> Informasi Supplier
      </h3>

      <!-- Supplier Search -->
      <div class="relative mb-4">
        <SearchDropdown v-model="supplierSearchModel" placeholder="Cari supplier..." :debounce="300"
          :min-search-length="3" item-key="id" item-label="name" not-found-text="Supplier tidak ditemukan"
          not-found-subtext="Coba kata kunci lain atau tambahkan supplier baru" add-button-text="Tambah Supplier Baru"
          api-url="/api/v1/suppliers" api-response-path="data.data" :use-api="true" @select="selectSupplier"
          @add-new="openAddSupplierDialog" @items-loaded="onSuppliersLoaded">
          <template #item="{ item }">
            <div class="font-medium text-secondary-900 dark:text-white">{{ item.name }}</div>
            <div class="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-2">
              <span>{{ item.phone || 'Tidak ada telepon' }}</span>
            </div>
          </template>
        </SearchDropdown>
      </div>

    </div>

    <!-- Ganti Dates Card dengan Supplier Info Card saat draft -->
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

    <!-- Tampilkan supplier yang dipilih -->
    <div v-else-if="supplierId"
      class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
      <div v-if="selectedSupplier" class="space-y-4">
        <!-- Supplier details -->
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-medium text-secondary-900 dark:text-white flex items-center">
              <Icon name="User" class="w-4 h-4 mr-2 text-primary-500" />
              {{ selectedSupplier?.name || 'Nama tidak ada' }}
            </h3>
            <p class="text-sm text-secondary-500 dark:text-secondary-400 flex items-center mt-1">
              <Icon name="Mail" class="w-4 h-4 mr-2 text-primary-500" />
              {{ selectedSupplier?.email || 'Email tidak ada' }}
            </p>
            <p class="text-sm text-secondary-500 dark:text-secondary-400 flex items-center mt-1">
              <Icon name="Phone" class="w-4 h-4 mr-2 text-primary-500" />
              {{ selectedSupplier?.phone || 'Telepon tidak ada' }}
            </p>
          </div>
          <div v-if="status === 'draft'" class="flex items-center">
            <button @click="$emit('update:supplierId', null)"
              class="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300">
              <Icon name="X" class="w-5 h-5" />
            </button>
          </div>
        </div>
        <!-- Other supplier details -->
      </div>
      <div v-else class="flex items-center justify-center py-4">
        <div class="flex flex-col items-center text-center">
          <Icon name="AlertCircle" class="w-8 h-8 text-amber-500 mb-2" />
          <p class="text-secondary-600 dark:text-secondary-400">
            Harap Cari Data Supplier.
          </p>
          <button v-if="status === 'draft'" @click="$emit('update:supplierId', null)"
            class="mt-2 text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
            Pilih supplier lain
          </button>
        </div>
      </div>
    </div>

    <!-- Tampilkan Order Dates jika status bukan draft -->
    <div v-if="status !== 'draft'"
      class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
      <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
        <i class="ri-calendar-line mr-2 text-primary-500"></i> Tanggal Order
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseDatePicker v-model="dateModel" label="Tanggal Order" required />

        <BaseDatePicker v-model="dueDateModel" label="Jatuh Tempo" required :min="dateModel" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Icon from '@/components/ui/Icon.vue'
import BaseDatePicker from '@/components/ui/BaseDatePicker.vue'
import SearchDropdown from '@/components/ui/SearchDropdown.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { api } from '@/services/api'

const props = defineProps({
  supplierId: {
    type: [Number, String],
    default: null
  },
  supplier: {
    type: Object,
    default: null
  },
  status: {
    type: String,
    default: 'draft'
  },
  supplier: {
    type: Object,
    default: () => { }
  },
  supplierSearch: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  dueDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'update:supplierId',
  'update:supplierSearch',
  'update:date',
  'update:dueDate',
  'add-supplier',
  'suppliers-loaded'
])

const selectedSupplier = ref(null)
// Computed
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

// const selectedSupplier = computed(() => {
//   return props.suppliers.find(s => s.id === props.supplierId) || null
// })

// Methods
const selectSupplier = (supplier) => {
  selectedSupplier.value = supplier
  emit('update:supplierId', supplier.id)

  emit('update:supplierSearch', '')
}

const openAddSupplierDialog = () => {
  selectedSupplier.value = null
  emit('add-supplier')
}

const onSuppliersLoaded = (suppliers) => {
  emit('suppliers-loaded', suppliers)
}

// Tambahkan fungsi untuk memuat supplier berdasarkan ID jika tidak ditemukan
const loadSupplierById = async () => {

  // console.log('Loading supplier by ID:', props.supplierId);


  if (!props.supplierId) return

  // Periksa apakah supplier sudah ada di props.suppliers
  // if (props.suppliers.some(s => s.id === props.supplierId)) return

  try {
    // console.log('Loading supplier by ID:', props.supplierId, props.supplier)
    const data = props.supplier
    selectedSupplier.value = data
    // console.log('Data :', data);

    if (data) {
      // Emit event dengan supplier yang dimuat
      // emit('suppliers-loaded', [...props.suppliers, data])
      // console.log('selectSupplier', data);
      selectSupplier(data)
      emit('suppliers-loaded', data)
    } else {
      // console.log('No data returned from API');

    }
  } catch (error) {
    console.error('Error loading supplier by ID:', error)
  }
}

// Lifecycle hooks
onMounted(() => {
  // Jika ada supplierId tapi tidak ada selectedSupplier, coba muat supplier
  if (props.supplierId && !selectedSupplier.value) {
    loadSupplierById()
  }
})

// Watch untuk perubahan supplierId
watch(() => props.supplierId, (newVal) => {
  if (newVal && !selectedSupplier.value) {
    loadSupplierById()
  }
})
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
