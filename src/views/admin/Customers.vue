<template>
  <BasePage title="Pelanggan" subtitle="Kelola data pelanggan Anda">
    <template #actions>
      <button type="button" @click="customerStore.setShowCustomerForm(true)"
        class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
        Tambah Pelanggan
      </button>
    </template>

    <template #search>
      <div class="relative rounded-md shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <i class="ri-search-line text-gray-400" />
        </div>
        <BaseInput v-model="customerStore.params.q" placeholder="Cari pelanggan..." type="text" class="w-full" clearable
          :debounce="500" @clear="customerStore.params.q = ''" @update:model-value="customerStore.setSearchQuery" />
      </div>
    </template>

    <!-- Customers Table Section with Scroll -->
    <div class="flex-1 overflow-auto relative">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <!-- In the table header section -->
              <thead class="bg-gray-100 dark:bg-dark-700">
                <tr>
                  <th scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 sm:pl-6">
                    Nama
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Telepon
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Piutang Awal
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Piutang Saat Ini
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>

              <!-- In the table body section -->
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-dark-800">
                <tr v-if="customerStore.loading" class="animate-pulse">
                  <td colspan="5" class="p-4 text-center text-gray-500 dark:text-gray-400">
                    Memuat data pelanggan...
                  </td>
                </tr>
                <tr v-else-if="customerStore.error" class="bg-red-50 dark:bg-red-900">
                  <td colspan="5" class="p-4 text-center text-red-600 dark:text-red-200">
                    {{ customerStore.error }}
                  </td>
                </tr>
                <tr v-else-if="!customerStore.filteredCustomers.length" class="bg-gray-50 dark:bg-gray-800">
                  <td colspan="5" class="p-4 text-center text-gray-500 dark:text-gray-400">
                    Tidak ada data pelanggan
                  </td>
                </tr>
                <tr v-for="customer in customerStore.filteredCustomers" :key="customer.id"
                  class="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td
                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-700 dark:text-gray-300 sm:pl-6">
                    {{ customer.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ customer.email }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ customer.phone }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ formatCurrency(customer.receivable?.initial_amount || 0) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ formatCurrency(customer?.total_piutang || 0) }}
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div class="space-x-2">
                      <IconButton @click="editCustomer(customer)" variant="primary" size="sm">
                        <template #icon>
                          <Icon name="Edit" class="w-4 h-4" />
                        </template>
                      </IconButton>
                      <IconButton @click="deleteCustomer(customer)" variant="danger" size="sm">
                        <template #icon>
                          <Icon name="Trash" class="w-4 h-4" />
                        </template>
                      </IconButton>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Form Modal -->
    <CustomerForm v-if="showCustomerForm" v-model="showCustomerForm" :customer="selectedCustomer"
      :is-edit="!!selectedCustomer" @close="handleClose" @submit="handleSubmit" />

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteModal" title="Hapus Pelanggan" @close="showDeleteModal = false">
      <div class="mt-2">
        <p class="text-sm text-gray-500 dark:text-gray-400">Apakah Anda yakin ingin menghapus pelanggan ini? Tindakan
          ini
          tidak dapat dibatalkan.</p>
      </div>
      <template #footer>
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button @click="confirmDelete"
            class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">
            Hapus
          </button>
          <button @click="showDeleteModal = false"
            class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm">
            Batal
          </button>
        </div>
      </template>
    </Modal>
  </BasePage>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useCustomerStore } from '@/stores/admin/customer'
import CustomerForm from '@/components/admin/customers/CustomerForm.vue'

const customerStore = useCustomerStore()
const selectedCustomer = ref(null)
const showDeleteModal = ref(false)
const customerToDelete = ref(null)

onMounted(() => {
  customerStore.fetchCustomers()
})

const showCustomerForm = computed({
  get: () => customerStore.showCustomerForm,
  set: (value) => customerStore.setShowCustomerForm(value)
})

const handleSubmit = async (formData) => {
  try {
    if (selectedCustomer.value) {
      await customerStore.updateCustomer({ ...formData, id: selectedCustomer.value.id })
    } else {
      await customerStore.addCustomer(formData)
    }
    closeForm()
  } catch (error) {
    // Error is handled by the store
  }
}

const handleClose = () => {
  closeForm()
}

const editCustomer = (customer) => {
  // Create a flattened version of the customer with receivable properties at the top level
  selectedCustomer.value = {
    ...customer,
    initial_amount: customer.receivable?.initial_amount || 0,
    notes: customer.receivable?.notes || ''
  }
  customerStore.setShowCustomerForm(true)
}

const deleteCustomer = (customer) => {
  customerToDelete.value = customer
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await customerStore.deleteCustomer(customerToDelete.value.id)
    showDeleteModal.value = false
    customerToDelete.value = null
  } catch (error) {
    // Error is handled by the store
  }
}

const closeForm = () => {
  selectedCustomer.value = null
  customerStore.setShowCustomerForm(false)
}

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value || 0)
}
</script>
