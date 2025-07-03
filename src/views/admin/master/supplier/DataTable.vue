<template>
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
                  Email & Alamat
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Phone
                </th>
                <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Saldo Awal Hutang
                </th>
                <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Hutang Saat Ini
                </th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-gray-700 dark:text-gray-300">
                  <span class="">Actions</span>
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
                  Suppliers Tidak ditemukan
                </td>
              </tr>
              <tr v-for="supplier in supplierStore.filteredSuppliers" :key="supplier.id"
                class="hover:bg-gray-50 dark:hover:bg-dark-700">
                <td
                  class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-700 dark:text-gray-300 sm:pl-6">
                  {{ supplier.name }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-600 dark:text-gray-400">
                  <div class="whitespace-nowrap">{{ supplier.email || '-' }}</div>
                  <div class="truncate">{{ supplier.address || '-' }}</div>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ supplier.phone || '-' }}
                </td>
                <td class="whitespace-nowrap text-right px-3 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ formatCurrency(supplier.debt?.initial_amount || 0) }}
                </td>
                <td class="whitespace-nowrap text-right px-3 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {{ formatCurrency(supplier.total_hutang || 0) }}
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
</template>

<script setup>
const props = defineProps({
  supplierStore: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete-supplier', 'edit-supplier'])

const editSupplier = (supplier) => {
  // Handle edit supplier logic here
  emit('edit-supplier', supplier)
}

const deleteSupplier = (supplier) => {
  // Handle delete supplier logic here
  emit('delete-supplier', supplier)
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
