<template>
  <div class="space-y-4">
    <!-- Customer Search Card -->
    <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
      :class="`${padding}`">
      <div class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
        <Icon name="User" class="mr-2 text-primary-500" /> Informasi Customer
      </div>
      <!-- Customer Search -->
      <div class="relative">
        <SearchDropdown v-model="customerSearchModel" placeholder="Cari customer..." :debounce="300"
          :min-search-length="3" item-key="id" item-label="name" not-found-text="Customer tidak ditemukan"
          not-found-subtext="Coba kata kunci lain atau tambahkan customer baru" add-button-text="Tambah Customer Baru"
          api-url="/api/v1/customers" api-response-path="data.data" :use-api="true" @select="selectCustomer"
          @add-new="openAddCustomerDialog" @items-loaded="onCustomersLoaded">
          <template #item="{ item }">
            <div class="font-medium text-secondary-900 dark:text-white">{{ item.name }}</div>
            <div class="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-2">
              <span>{{ item.phone || 'Tidak ada telepon' }}</span>
            </div>
          </template>
        </SearchDropdown>
      </div>
    </div>
    <!-- Ganti Dates Card dengan Customer Info Card saat draft -->
    <div v-if="!customerId"
      class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
      <div class="flex flex-col items-center justify-center py-6 text-center">
        <Icon name="UserSearch" class="w-12 h-12 text-primary-400 mb-3" />
        <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-2">Belum Ada Customer</h3>
        <p class="text-secondary-500 dark:text-secondary-400 text-sm max-w-md">
          Silakan cari dan pilih customer di atas untuk melanjutkan transaksi Anda
        </p>
      </div>
    </div>
    <!-- Tampilkan customer yang dipilih -->
    <div v-else
      class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-2 transition-all duration-300 hover:shadow-md relative">
      <div v-if="selectedCustomer" class="gap-4 relative">
        <!-- Customer details -->
        <div class="flex justify-between items-start relative">
          <div class="relative w-full">
            <h3 class="text-lg font-medium text-secondary-900 dark:text-white flex items-center">
              <Icon name="User" class="w-4 h-4 mr-2 text-primary-500" />
              {{ selectedCustomer?.name || 'Nama tidak ada' }}
            </h3>
            <p class="text-sm text-secondary-500 dark:text-secondary-400 flex items-center mt-1">
              <Icon name="Mail" class="w-4 h-4 mr-2 text-primary-500" />
              {{ selectedCustomer?.email || 'Email tidak ada' }}
            </p>
            <p class="text-sm text-secondary-500 dark:text-secondary-400 flex items-center mt-1">
              <Icon name="Phone" class="w-4 h-4 mr-2 text-primary-500" />
              {{ selectedCustomer?.phone || 'Telepon tidak ada' }}
            </p>


          </div>



        </div>


      </div>

      <div class="absolute top-0 right-0">
        <button @click="$emit('update:customerId', null)"
          class="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300">
          <Icon name="X" class="w-5 h-5" />
        </button>
      </div>
    </div>
    <!-- Tampilkan Order Dates jika status bukan draft -->
    <div v-if="status !== 'draft'"
      class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-2 transition-all duration-300 hover:shadow-md">
      <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
        <i class="ri-calendar-line mr-2 text-primary-500"></i> Tanggal Transaksi
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseDatePicker v-model="dateModel" label="Tanggal Transaksi" required />
        <BaseDatePicker v-model="dueDateModel" label="Jatuh Tempo" required :min="dateModel" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Icon from '@/components/ui/Icon.vue'
// import BaseDatePicker from '@/components/ui/BaseDatePicker.vue'
// import SearchDropdown from '@/components/ui/SearchDropdown.vue'
import { api } from '@/services/api'
const props = defineProps({
  customerId: {
    type: [Number, String],
    default: null
  },
  status: {
    type: String,
    default: 'draft'
  },
  customers: {
    type: Array,
    default: () => []
  },
  customer: {
    type: Object,
    default: null
  },
  customerSearch: {
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
  },
  padding: {
    type: String,
    default: 'p-2'
  }
})
const emit = defineEmits([
  'update:customerId',
  'update:customer',
  'update:customerSearch',
  'update:date',
  'update:dueDate',
  'add-customer',
  'customers-loaded'
])
const customerSearchModel = computed({
  get: () => props.customerSearch,
  set: (value) => emit('update:customerSearch', value)
})
const dateModel = computed({
  get: () => props.date,
  set: (value) => emit('update:date', value)
})
const dueDateModel = computed({
  get: () => props.dueDate,
  set: (value) => emit('update:dueDate', value)
})
// const selectedCustomer = ref(null)
const selectedCustomer = computed({

  get: () => {
    // console.log('selectedCustomerGet', props.customer);

    return props.customer
  },
  set: (value) => emit('update:customer', value)
})
const selectCustomer = (customer) => {
  // console.log('customer', customer);
  emit('update:customerId', customer.id)
  emit('update:customer', customer)
  emit('update:customerSearch', '')
  selectedCustomer.value = customer
}
const openAddCustomerDialog = () => {
  emit('add-customer')
}
const onCustomersLoaded = (customers) => {
  emit('customers-loaded', customers)
}
const loadCustomerById = async () => {
  console.log('Loading customer by ID:', props.customerId);


  if (!props.customerId) return


  try {
    console.log('Loading customer by ID:', props.customerId)
    const data = selectedCustomer.value
    console.log('Data :', data);

    if (data) {
      // Emit event dengan supplier yang dimuat
      // emit('suppliers-loaded', [...props.suppliers, data])
      selectCustomer(data)
      emit('suppliers-loaded', data)
    } else {
      console.log('No data returned from API');

    }
  } catch (error) {
    console.error('Error loading customer by ID:', error)
  }
}
onMounted(() => {
  if (props.customerId && !selectedCustomer.value) {
    loadCustomerById()
  }
})
watch(() => props.customerId, (newVal) => {
  if (newVal && !selectedCustomer.value) {
    loadCustomerById()
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
