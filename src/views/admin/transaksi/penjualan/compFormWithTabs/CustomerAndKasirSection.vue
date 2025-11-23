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
      :customer-search="customerSearch" @request-change="handleCustomerChangeRequest"
      @update:customerSearch="customerSearch = $event" @add-customer="openAddCustomerDialog"
      @customers-loaded="onCustomerLoaded" class="mb-2" />

    <CustomerForm v-if="showCustomerForm" v-model="showCustomerForm" :customer="null" :is-edit="false"
      @close="customerStore.setShowCustomerForm(false)" @submit="handleCustomerSubmit" />

    <!-- Confirmation Modal -->
    <Modal v-model="showConfirmationModal" title="Konfirmasi Perubahan Customer" size="md" :persistent="true">
      <div class="p-4">
        <p class="text-gray-700 dark:text-gray-300 text-base">
          Keranjang belanja sudah terisi. Mengganti customer akan
          <span class="font-bold text-red-600 dark:text-red-400">mengosongkan seluruh isi keranjang</span>.
        </p>
        <p class="text-gray-700 dark:text-gray-300 mt-2">
          Anda yakin ingin melanjutkan?
        </p>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-4">
          <BaseButton label="Batal" variant="ghost" @click="cancelChange" />
          <BaseButton label="Ya, Lanjutkan" variant="danger" @click="confirmChange" />
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { useSalesFormWitTabsStore } from '@/stores/transaksi/penjualan/formwithtabs';
import { useCustomerStore } from '@/stores/admin/customer';
import { useAuthStore } from '@/stores/auth';
import Icon from '@/components/ui/Icon.vue';
import Modal from '@/components/ui/Modal.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const emit = defineEmits(['customer-selected']);

const CustomerSelection = defineAsyncComponent(() => import('@/components/admin/transaksi/penjualan/CustomerSelection.vue'))
const CustomerForm = defineAsyncComponent(() => import('@/components/admin/customers/CustomerForm.vue'))

const store = useSalesFormWitTabsStore()
const customerStore = useCustomerStore()
const auth = useAuthStore()

const customerSearch = ref('')
const showCustomerForm = ref(false)

const showConfirmationModal = ref(false)
const pendingCustomer = ref(null)

const cashier = computed(() => {
  return {
    name: auth?.user?.name || 'Kasir Demo',
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

function handleCustomerChangeRequest(newCustomer) {
  if (store.listItems.length > 0 && store.isiTab.customer_id !== newCustomer?.id) {
    pendingCustomer.value = newCustomer;
    showConfirmationModal.value = true;
  } else {
    // If cart is empty or the same customer is selected, update directly
    store.isiTab.customer = newCustomer;
    store.isiTab.customer_id = newCustomer?.id;
    if (newCustomer) {
      emit('customer-selected');
    }
  }
}

function confirmChange() {
  store.setItems([]); // Clear the cart
  store.isiTab.customer = pendingCustomer.value;
  store.isiTab.customer_id = pendingCustomer.value?.id;
  showConfirmationModal.value = false;

  if (store.isiTab.customer_id) {
    emit('customer-selected');
  }
  pendingCustomer.value = null;
}

function cancelChange() {
  showConfirmationModal.value = false;
  pendingCustomer.value = null;
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
}
const handleCustomerSubmit = async (formData) => {
  try {
    const newCustomer = await customerStore.addCustomer(formData)
    showCustomerForm.value = false
    // Otomatis pilih customer yang baru ditambahkan
    if (newCustomer?.id) {
      handleCustomerChangeRequest(newCustomer);
    }
  } catch (error) {
    console.error('Error adding customer:', error)
  }
}

const openAddCustomerDialog = () => {
  showCustomerForm.value = true
}

</script>
