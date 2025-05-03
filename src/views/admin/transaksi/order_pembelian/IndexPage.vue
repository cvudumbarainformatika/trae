<template>
  <BasePage title="Order Pembelian" subtitle="Manage Order Pemebelian dari Supplier">
    <template #actions>
      <BaseButton
        @click="purchaseOrderStore.showCreateDialog = true"
        variant="primary"
        size="md"
        class="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px]"
      >
        <template #icon-left>
          <Icon name="Plus" class="w-4 h-4" />
        </template>
        Tambah Order
      </BaseButton>
    </template>

    <template #search>
      <div class="relative rounded-full shadow-lg">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Icon name="Search" class="w-5 h-5 text-indigo-400" />
        </div>
        <BaseInput
          v-model="purchaseOrderStore.searchQuery"
          placeholder="Cari order pembelian..."
          type="text"

          clearable
          :debounce="500"
          @update:model-value="purchaseOrderStore.fetchPurchaseOrders"
        />
      </div>
    </template>

    <!-- Futuristic Order List Section -->
    <BaseList
      :items="purchaseOrderStore.items"
      :loading="purchaseOrderStore.loading"
      :pagination="purchaseOrderStore.pagination"
      empty-icon="PackageOpen"
      empty-title="Belum Ada Order"
      empty-description="Belum ada order pembelian yang tersedia. Klik tombol 'Tambah Order' untuk membuat order baru."
      @page-change="handlePageChange"
    >
      <template #item="{ item }">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group hover:border-indigo-200 dark:hover:border-indigo-800">
          <div class="flex flex-col md:flex-row">
            <!-- Order Status Badge -->
            <div class="w-full md:w-1 h-1 md:h-auto"
                 :class="{
                   'bg-yellow-400': item.status === 'draft',
                   'bg-blue-500': item.status === 'ordered',
                   'bg-green-500': item.status === 'received',
                   'bg-red-500': item.status === 'cancelled'
                 }">
            </div>

            <!-- Order Content - Redesigned -->
            <div class="flex-1 p-4">
              <div class="flex items-start justify-between">
                <!-- Left: Supplier Name and Order Details -->
                <div>
                  <!-- Supplier Name - Larger -->
                  <h3 class="text-base font-medium text-gray-900 dark:text-white mb-1 flex items-center">
                    <Icon name="Building" class="w-4 h-4 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                    {{ item.supplier?.name || 'Supplier tidak diketahui' }}
                  </h3>

                  <!-- Order Details - Below Supplier -->
                  <div class="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-x-3">
                    <div class="flex items-center">
                      <Icon name="Calendar" class="w-3.5 h-3.5 mr-1" />
                      <span>{{ new Date(item.date).toLocaleDateString() }}</span>
                    </div>
                    <div class="flex items-center">
                      <Icon name="ShoppingCart" class="w-3.5 h-3.5 mr-1" />
                      <span>{{ item.items?.length || 0 }} items</span>
                    </div>
                  </div>


                </div>

                <!-- Right: Amount - Larger -->
                <div class="text-right">
                  <div class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.total_amount || 0) }}
                  </div>
                </div>
              </div>

              <!-- Action Buttons and Status - Inline with justify-between -->
              <div class="flex justify-between items-center mt-2">
                <!-- Status Badge -->
                <div class="flex gap-x-4 items-center  text-gray-500 dark:text-gray-400">
                  <div class="flex space-x-1 items-center">
                    <Icon name="Receipt" class="w-4 h-4" />
                    <div class="text-base">{{ item?.unique_code }}</div>
                  </div>
                  <span class="text-xs px-2 py-0.5 rounded-full"
                      :class="{
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': item.status === 'draft',
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': item.status === 'ordered',
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': item.status === 'received',
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': item.status === 'cancelled'
                      }">
                  {{ item.status === 'draft' ? 'Draft' :
                     item.status === 'ordered' ? 'Ordered' :
                     item.status === 'received' ? 'Received' : 'Cancelled' }}
                </span>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-3">
                  <button
                    v-if="item.status === 'draft'"
                    @click.stop="editPurchaseOrder(item.id)"
                    class="p-1 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                    title="Edit"
                  >
                    <Icon name="Edit" class="w-3.5 h-3.5" />
                  </button>
                  <button @click="viewPurchaseOrderDetail(item.id)" class="p-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 dark:text-indigo-400 transition-colors">
                    <Icon name="Eye" class="w-3.5 h-3.5" />
                  </button>
                  <button class="p-1.5 rounded-full bg-green-50 hover:bg-green-100 text-green-600 dark:bg-green-900/30 dark:hover:bg-green-800/50 dark:text-green-400 transition-colors">
                    <Icon name="Edit" class="w-3.5 h-3.5" />
                  </button>
                  <button class="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-800/50 dark:text-red-400 transition-colors">
                    <Icon name="Trash" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </BaseList>

    <PurchaseOrderForm
      v-model="purchaseOrderStore.showCreateDialog"
      @success="handleFormSuccess"
      @close="handleFormClose"
    />

    <PurchaseOrderDetail
      v-model="showDetailDialog"
      :purchase-order-id="selectedPurchaseOrderId"
      @status-updated="handleStatusUpdated"
    />
  </BasePage>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePurchaseOrderStore } from '@/stores/transaksi/order_pembelian'
import PurchaseOrderForm from './PurchaseOrderForm.vue'
import PurchaseOrderDetail from './PurchaseOrderDetail.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BasePage from '@/components/ui/BasePage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseList from '@/components/ui/BaseList.vue'
import Icon from '@/components/ui/Icon.vue'

const purchaseOrderStore = usePurchaseOrderStore()
const showDetailDialog = ref(false)
const selectedPurchaseOrderId = ref(null)

// Fetch initial data
onMounted(() => {
  purchaseOrderStore.fetchPurchaseOrders()
})

// Handle page change
const handlePageChange = (page) => {
  if (page < 1 || page > Math.ceil(purchaseOrderStore.pagination.totalItems / purchaseOrderStore.pagination.itemsPerPage)) {
    return
  }

  purchaseOrderStore.pagination = {
    ...purchaseOrderStore.pagination,
    page
  }

  purchaseOrderStore.fetchPurchaseOrders()
}

// View purchase order detail
const viewPurchaseOrderDetail = (id) => {
  selectedPurchaseOrderId.value = id
  showDetailDialog.value = true
}

// Add edit function
const editPurchaseOrder = async (id) => {
  try {
    // Reset form terlebih dahulu
    purchaseOrderStore.resetForm()

    // Muat semua supplier terlebih dahulu
    if (typeof purchaseOrderStore.fetchSuppliers === 'function') {
      await purchaseOrderStore.fetchSuppliers()
    }

    // Ambil data PO
    await purchaseOrderStore.fetchPurchaseOrderById(id)

    // Set mode edit
    purchaseOrderStore.setEditMode(id)

    // Tampilkan dialog
    purchaseOrderStore.showCreateDialog = true

    // Log untuk debugging
    console.log('Edit mode activated for PO ID:', id)
    console.log('Supplier ID:', purchaseOrderStore.form.supplier_id)
    console.log('Available suppliers:', purchaseOrderStore.suppliers)
  } catch (error) {
    console.error('Error preparing purchase order for edit:', error)
  }
}

// Handle form success
const handleFormSuccess = () => {
  purchaseOrderStore.fetchPurchaseOrders()
}

// Handle form close
const handleFormClose = () => {
  purchaseOrderStore.showCreateDialog = false
}

// Handle status updated
const handleStatusUpdated = () => {
  purchaseOrderStore.fetchPurchaseOrders()
}
</script>

<style scoped>
/* Tambahkan animasi hover untuk card */
.group:hover {
  transform: translateY(-2px);
}
</style>
