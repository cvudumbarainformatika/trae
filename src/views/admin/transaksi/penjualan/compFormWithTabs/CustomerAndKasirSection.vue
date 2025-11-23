<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2">
    <div class=" mb-1" :class="`${store.isiTab.category === 'umum' ? '' : ''}`">
      <div
        class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="flex-shrink-0">
          <Icon name="user" class="w-10 h-10 text-primary-500 bg-primary-100 dark:bg-primary-900 rounded-full p-1" />
        </div>
        <div>
          <div class="font-semibold text-gray-900 dark:text-white">{{ cashier.name }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Kasir Saat Ini</div>
        </div>
      </div>
    </div>

    <div class="mb-2">
      <div
        class="flex items-center justify-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
        <span class="font-mono text-2xl font-semibold text-primary-600 dark:text-primary-400 tracking-widest">{{
          currentTime }}</span>
      </div>
    </div>

    <CustomerSelection :customer-id="store.isiTab.customer_id" :customer="store.isiTab.customer"
      :customer-search="customerSearch" @update:customerId="store.isiTab.customer_id = $event"
      @update:customerSearch="customerSearch = $event" @update:customer="store.isiTab.customer = $event"
      @add-customer="openAddCustomerDialog" @customers-loaded="onCustomerLoaded" class="mb-2" />

    <CustomerForm v-if="showCustomerForm" v-model="showCustomerForm" :customer="null" :is-edit="false"
      @close="customerStore.setShowCustomerForm(false)" @submit="handleCustomerSubmit" />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { useSalesFormWitTabsStore } from '@/stores/transaksi/penjualan/formwithtabs';
import { useCustomerStore } from '@/stores/admin/customer';
import { useAuthStore } from '@/stores/auth';
import Icon from '@/components/ui/Icon.vue';

const CustomerSelection = defineAsyncComponent(() => import('@/components/admin/transaksi/penjualan/CustomerSelection.vue'))
const CustomerForm = defineAsyncComponent(() => import('@/components/admin/customers/CustomerForm.vue'))

const store = useSalesFormWitTabsStore()
const customerStore = useCustomerStore()
const auth = useAuthStore()

const customerSearch = ref('')
const showCustomerForm = ref(false)
const showCustomerResults = ref(false)
const filteredCustomers = ref([])
const salesType = ref('umum')

// Example: get current cashier from store or auth (replace with actual logic)
const cashier = computed(() => {
  // Replace with actual user data source if available
  return {
    name: auth?.user?.name || 'Kasir Demo',
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
  updateClock()
  timer = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const onCustomerLoaded = (customers) => {
  // console.log('Customers loaded:', customers);

  filteredCustomers.value = customers
}
const handleCustomerSubmit = async (formData) => {
  try {
    const newCustomer = await customerStore.addCustomer(formData)
    showCustomerForm.value = false
    // Otomatis pilih customer yang baru ditambahkan
    if (newCustomer?.id) {
      store.isiTab.customer_id = newCustomer.id
      store.isiTab.customer = newCustomer
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
