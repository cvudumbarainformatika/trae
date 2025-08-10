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



    <!-- <div class="text-xs font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
      <Icon name="receipt" class="mr-2 text-primary-500" /> {{ store.isiTab.unique_code }}
    </div> -->
    <div class="mb-4 flex items-center w-full gap-4 justify-center">
      <div
        class="inline-flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 w-64 justify-center">
        <label
          :class="['text-sm font-medium text-gray-700 dark:text-gray-200 px-4 py-2 cursor-pointer select-none transition-colors', store.isiTab.category === 'umum' ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-semibold shadow' : 'text-gray-700 dark:text-gray-200']">
          <input type="radio" v-model="store.isiTab.category" value="umum" class="hidden" />
          Umum
        </label>
        <label
          :class="['text-sm font-medium px-2 py-2 cursor-pointer select-none transition-colors', store.isiTab.category === 'pelanggan' ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-semibold shadow' : 'text-gray-700 dark:text-gray-200']">
          <input type="radio" v-model="store.isiTab.category" value="pelanggan" class="hidden" />
          Member
        </label>
        <label
          :class="['text-sm font-medium px-4 py-2 cursor-pointer select-none transition-colors', store.isiTab.category === 'antar' ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-semibold shadow' : 'text-gray-700 dark:text-gray-200']">
          <input type="radio" v-model="store.isiTab.category" value="antar" class="hidden" />
          Antar
        </label>
      </div>
    </div>

    <!-- INI KARENA GAK PAKAI PELANGGAN HUTANG -->

    <!-- <CustomerSelection v-if="store.isiTab.category === 'pelanggan'" :customer-id="store.isiTab.customer_id"
      :customer="store.isiTab.customer" :customer-search="customerSearch"
      @update:customerId="store.isiTab.customer_id = $event" @update:customerSearch="customerSearch = $event"
      @update:customer="store.isiTab.customer = $event" @add-customer="openAddCustomerDialog"
      @customers-loaded="onCustomerLoaded" class="mb-2" /> -->

    <div>
      <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md">
        <div class="flex flex-col items-center justify-center py-6 text-center">
          <Icon name="UserSearch" class="w-12 h-12 text-primary-400 mb-3" />
          <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            {{ store.isiTab.category === 'umum' ? 'HargaUmum' : store.isiTab.category === 'pelanggan' ? 'Member' :
              'Antar' }}
          </h3>
          <p class="text-secondary-500 dark:text-secondary-400 text-sm max-w-md">
            Semua Harga Penjualan dihitung berdasarkan customer umum
          </p>
        </div>
      </div>
    </div>

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
