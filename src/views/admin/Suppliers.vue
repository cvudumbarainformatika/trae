<template>
  <BasePage title="Suppliers" subtitle="Manage your product suppliers">
    <template #actions>
      <button
        type="button"
        @click="supplierStore.setShowSupplierForm(true)"
        class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
      >
        Add Supplier
      </button>
    </template>

    <template #search>
      <div class="relative rounded-md shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <i class="ri-search-line text-gray-400" />
        </div>
        <BaseInput
          v-model="supplierStore.params.q"
          placeholder="Search suppliers..."
          type="text"
          class="w-full"
          clearable
          :debounce="500"
          @clear="supplierStore.params.q = ''"
          @update:model-value="supplierStore.setSearchQuery"
        />
      </div>
    </template>

    <!-- Suppliers Table Section with Scroll -->
    <div class="flex-1 overflow-auto relative">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <!-- In the table header section -->
              <thead class="bg-gray-100 dark:bg-dark-700">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 sm:pl-6">
                    Name
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Phone
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Initial Amount
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Current Amount
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              
              <!-- In the table body section -->
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-dark-800">
                <tr v-if="supplierStore.loading" class="animate-pulse">
                  <td colspan="5" class="p-4 text-center text-gray-500 dark:text-gray-400">
                    Loading suppliers...
                  </td>
                </tr>
                <tr v-else-if="supplierStore.error" class="bg-red-50 dark:bg-red-900">
                  <td colspan="5" class="p-4 text-center text-red-600 dark:text-red-200">
                    {{ supplierStore.error }}
                  </td>
                </tr>
                <tr v-else-if="!supplierStore.filteredSuppliers.length" class="bg-gray-50 dark:bg-gray-800">
                  <td colspan="5" class="p-4 text-center text-gray-500 dark:text-gray-400">
                    No suppliers found
                  </td>
                </tr>
                <tr v-for="supplier in supplierStore.filteredSuppliers" :key="supplier.id" class="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-700 dark:text-gray-300 sm:pl-6">
                    {{ supplier.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ supplier.email }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ supplier.phone }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ formatCurrency(supplier.debt?.initial_amount || 0) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {{ formatCurrency(supplier.debt?.current_amount || 0) }}
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div class="space-x-2">
                      <IconButton @click="editSupplier(supplier)" variant="primary" size="sm">
                        <template #icon>
                          <Icon name="Edit" class="w-4 h-4" />
                        </template>
                      </IconButton>
                      <IconButton @click="deleteSupplier(supplier)" variant="danger" size="sm">
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

    <!-- Supplier Form Modal -->
    <SupplierForm
      v-if="showSupplierForm"
      v-model="showSupplierForm"
      :supplier="selectedSupplier"
      :is-edit="!!selectedSupplier"
      @close="handleClose"
      @submit="handleSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <Modal 
      v-model="showDeleteModal" 
      title="Delete Supplier"
      @close="showDeleteModal = false"
    >
      <div class="mt-2">
        <p class="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this supplier? This action cannot be undone.</p>
      </div>
      <template #footer>
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            @click="confirmDelete"
            class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Delete
          </button>
          <button
            @click="showDeleteModal = false"
            class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </template>
    </Modal>
  </BasePage>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useSupplierStore } from '@/stores/admin/supplier'
import SupplierForm from '@/components/admin/suppliers/SupplierForm.vue'

const supplierStore = useSupplierStore()
const selectedSupplier = ref(null)
const showDeleteModal = ref(false)
const supplierToDelete = ref(null)

onMounted(() => {
  supplierStore.fetchSuppliers()
})

const showSupplierForm = computed({
  get: () => supplierStore.showSupplierForm,
  set: (value) => supplierStore.setShowSupplierForm(value)
})

const handleSubmit = async (formData) => {
  try {
    if (selectedSupplier.value) {
      await supplierStore.updateSupplier({ ...formData, id: selectedSupplier.value.id })
    } else {
      await supplierStore.addSupplier(formData)
    }
    closeForm()
  } catch (error) {
    // Error is handled by the store
  }
}

const handleClose = () => {
  closeForm()
}

const editSupplier = (supplier) => {
  // Create a flattened version of the supplier with debt properties at the top level
  // and convert initial_amount to integer by removing decimal places
  selectedSupplier.value = { 
    ...supplier,
    initial_amount: supplier.debt?.initial_amount ? Math.floor(parseFloat(supplier.debt.initial_amount)) : 0,
    notes: supplier.debt?.notes || ''
  }
  supplierStore.setShowSupplierForm(true)
}

const deleteSupplier = (supplier) => {
  supplierToDelete.value = supplier
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await supplierStore.deleteSupplier(supplierToDelete.value.id)
    showDeleteModal.value = false
    supplierToDelete.value = null
  } catch (error) {
    // Error is handled by the store
  }
}

const closeForm = () => {
  selectedSupplier.value = null
  supplierStore.setShowSupplierForm(false)
}

// Add this to the script section
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value || 0)
}
</script>