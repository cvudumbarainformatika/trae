<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSupplierStore } from '@/stores/admin/supplier'
import SupplierForm from '@/components/admin/SupplierForm.vue'

// Store initialization
const supplierStore = useSupplierStore()

// State management
const selectedSupplier = ref(null)
const isEdit = ref(false)

// Fetch suppliers on component mount
onMounted(() => {
  supplierStore.fetchSuppliers()
})

// Computed properties
const showSupplierForm = computed({
  get: () => supplierStore.showSupplierForm,
  set: (value) => supplierStore.setShowSupplierForm(value)
})

const searchQuery = computed({
  get: () => supplierStore.searchQuery,
  set: (value) => supplierStore.setSearchQuery(value)
})

const suppliers = computed(() => supplierStore.suppliers)
const pagination = computed(() => supplierStore.paginationInfo)

// Event handlers
const handleAddSupplier = () => {
  selectedSupplier.value = null
  isEdit.value = false
  showSupplierForm.value = true
}

const handleEditSupplier = (supplier) => {
  selectedSupplier.value = { ...supplier }
  isEdit.value = true
  showSupplierForm.value = true
}

const handleDeleteSupplier = async (supplierId) => {
  if (confirm('Apakah Anda yakin ingin menghapus supplier ini?')) {
    try {
      await supplierStore.deleteSupplier(supplierId)
    } catch (error) {
      console.error('Error deleting supplier:', error)
    }
  }
}

const handleSupplierSubmit = () => {
  showSupplierForm.value = false
  supplierStore.fetchSuppliers()
}

const handleSupplierCancel = () => {
  showSupplierForm.value = false
  selectedSupplier.value = null
  isEdit.value = false
}

const handlePageChange = (page) => {
  supplierStore.setCurrentPage(page)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Supplier</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Kelola daftar supplier Anda</p>
      </div>
      <BaseButton
        variant="primary"
        @click="handleAddSupplier"
      >
        <span class="material-icons mr-2">add</span>
        Tambah Supplier
      </BaseButton>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white dark:bg-dark-800 rounded-lg shadow-sm p-4 mb-6">
      <div class="flex items-center space-x-4">
        <div class="flex-1">
          <BaseInput
            v-model="searchQuery"
            type="search"
            placeholder="Cari supplier..."
            clearable
          >
            <template #prefix>
              <span class="material-icons text-gray-400">search</span>
            </template>
          </BaseInput>
        </div>
      </div>
    </div>

    <!-- Suppliers Table -->
    <div class="bg-white dark:bg-dark-800 rounded-lg shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-dark-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Telepon</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Alamat</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="supplier in suppliers" :key="supplier.id" class="hover:bg-gray-50 dark:hover:bg-dark-700">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ supplier.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ supplier.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ supplier.phone }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ supplier.address }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <BaseButton
                  variant="secondary"
                  size="sm"
                  @click="handleEditSupplier(supplier)"
                >
                  <span class="material-icons">edit</span>
                </BaseButton>
                <BaseButton
                  variant="danger"
                  size="sm"
                  @click="handleDeleteSupplier(supplier.id)"
                >
                  <span class="material-icons">delete</span>
                </BaseButton>
              </div>
            </td>
          </tr>
          <tr v-if="suppliers.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
              Tidak ada supplier yang ditemukan
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="suppliers.length > 0" class="mt-4 flex justify-center">
      <BasePagination
        :current-page="pagination.currentPage"
        :total-pages="pagination.totalPages"
        :start-page="pagination.startPage"
        :end-page="pagination.endPage"
        @page-change="handlePageChange"
      />
    </div>

    <!-- Supplier Form Modal -->
    <BaseModal
      v-model="showSupplierForm"
      :title="isEdit ? 'Edit Supplier' : 'Tambah Supplier'"
      size="lg"
    >
      <SupplierForm
        :supplier="selectedSupplier"
        :is-edit="isEdit"
        @submit="handleSupplierSubmit"
        @cancel="handleSupplierCancel"
      />
    </BaseModal>
  </div>
</template>