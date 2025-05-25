<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
    <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
      <Icon name="info" class="mr-2 text-primary-500" /> Informasi Penjualan
    </h3>
    <div class="text-xs font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
      <Icon name="receipt" class="mr-2 text-primary-500" /> {{ store.unique_code  }}
    </div>
    <div class="mb-4 flex items-center gap-4 justify-center">
      <div class="inline-flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 w-64 justify-center">
        <label :class="['px-4 py-2 cursor-pointer select-none transition-colors', store.category === 'umum' ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-semibold shadow' : 'text-gray-700 dark:text-gray-200']">
          <input type="radio" v-model="store.category" value="umum" class="hidden" />
          Umum
        </label>
        <label :class="['px-4 py-2 cursor-pointer select-none transition-colors', store.category === 'pelanggan' ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-semibold shadow' : 'text-gray-700 dark:text-gray-200']">
          <input type="radio" v-model="store.category" value="pelanggan" class="hidden" />
          Pelanggan
        </label>
      </div>
    </div>

    <CustomerSelection
      v-if="store.category === 'pelanggan'"
      :customer-id="store.customer_id"
      :customer-search="customerSearch"
      @update:customerId="store.customer_id = $event"
      @update:customerSearch="customerSearch = $event"
      @add-customer="openAddCustomerDialog"
      @customers-loaded="onCustomerLoaded"
    />
    <CustomerForm
      v-if="showCustomerForm"
      v-model="showCustomerForm"
      :customer="null"
      :is-edit="false"
      @close="customerStore.setShowCustomerForm(false)"
      @submit="handleCustomerSubmit"
    />

    <div class=" mb-4" :class="`${store.category === 'umum'? '': ''}`">
      <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="flex-shrink-0">
          <Icon name="user" class="w-8 h-8 text-primary-500 bg-primary-100 dark:bg-primary-900 rounded-full p-1" />
        </div>
        <div>
          <div class="font-semibold text-gray-900 dark:text-white">{{ cashier.name }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Kasir Saat Ini</div>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <div class="flex items-center justify-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
        <span class="font-mono text-2xl font-semibold text-primary-600 dark:text-primary-400 tracking-widest">{{ currentTime }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { useSalesFormStore } from '@/stores/transaksi/penjualan/form';
import { useCustomerStore } from '@/stores/admin/customer';
import Icon from '@/components/ui/Icon.vue';

const CustomerSelection = defineAsyncComponent(()=> import('@/components/admin/transaksi/penjualan/CustomerSelection.vue'))
const CustomerForm = defineAsyncComponent(()=> import('@/components/admin/customers/CustomerForm.vue'))
const store = useSalesFormStore()
const customerStore = useCustomerStore()

const customerSearch = ref('')
const showCustomerForm = ref(false)
const showCustomerResults = ref(false)
const filteredCustomers = ref([])
const salesType = ref('umum')

// Example: get current cashier from store or auth (replace with actual logic)
const cashier = computed(() => {
  // Replace with actual user data source if available
  return {
    name: 'Kasir Demo',
    // Add more fields if needed
  }
})

const currentTime = ref('')
let timer = null

const updateClock = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

onMounted(() => {
  store.generateUniqueCode()
  updateClock()
  timer = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const onCustomerLoaded = (customers) => {
  filteredCustomers.value = customers
}
const handleCustomerSubmit = async (formData) => {
  try {
    const newCustomer = await customerStore.addCustomer(formData)
    showCustomerForm.value = false
    // Otomatis pilih customer yang baru ditambahkan
    if (newCustomer?.id) {
      store.customer_id = newCustomer.id
    }
  } catch (error) {
    console.error('Error adding customer:', error)
  }
}

const openAddCustomerDialog = () => {
  showCustomerForm.value = true
  showCustomerResults.value = false
}

</script>
