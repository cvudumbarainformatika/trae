<template>
  <BasePage title="Order Pembelian" subtitle="Manage Order Pemebelian dari Supplier">
    <template #actions>
      <div class="flex items-center gap-2">
        <BaseButton @click="purchaseOrderStore.showCreateDialog = true" variant="primary" size="md"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px]">
          <template #icon-left>
            <Icon name="Plus" class="w-4 h-4" />
          </template>
          Tambah Order
        </BaseButton>
      </div>
    </template>

    <template #search>
      <div class="flex items-center justify-between gap-2 w-full">
        <!-- Search Input (dengan lebar yang cukup) -->
        <div class="relative rounded-full shadow-lg min-w-[300px]">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Icon name="Search" class="w-5 h-5 text-indigo-400" />
          </div>
          <BaseInput v-model="purchaseOrderStore.searchQuery" placeholder="Cari order pembelian..." type="text"
            clearable :debounce="500" @update:model-value="purchaseOrderStore.fetchPurchaseOrders" />
        </div>

        <!-- Filter Periode -->
        <div class="flex-1 flex justify-end">
          <BaseDateRangeFilter v-model="dateRange" @change="handleDateRangeChange" default-period="month" />
        </div>
      </div>
    </template>

    <!-- Status Filter Buttons -->
    <div class="flex flex-wrap gap-2 mb-4 mt-2">
      <BaseButton variant="ghost" size="sm"
        class="relative overflow-hidden group border border-gray-200 dark:border-gray-700 rounded-full px-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
        :class="{ 'bg-indigo-700 border-indigo-300 dark:border-indigo-700': purchaseOrderStore.params.status === 'semua' }"
        @click="purchaseOrderStore.changeStatusParams('semua')">
        <span class="relative z-10">Semua</span>
        <span
          class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
      </BaseButton>

      <BaseButton @click="purchaseOrderStore.changeStatusParams('draft')" variant="ghost" size="sm"
        class="relative overflow-hidden group border border-gray-200 dark:border-gray-700 rounded-full px-6 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all duration-300"
        :class="{ 'bg-indigo-700 border-indigo-300 dark:border-indigo-700': purchaseOrderStore.params.status === 'draft' }">
        <span class="relative z-10 flex items-center">
          <span class="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
          Draft
        </span>
        <span
          class="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
      </BaseButton>

      <BaseButton @click="purchaseOrderStore.changeStatusParams('ordered')" variant="ghost" size="sm"
        class="relative overflow-hidden group border border-gray-200 dark:border-gray-700 rounded-full px-6 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
        :class="{ 'bg-indigo-700 border-indigo-300 dark:border-indigo-700': purchaseOrderStore.params.status === 'ordered' }">
        <span class="relative z-10 flex items-center">
          <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
          Ordered
        </span>
        <span
          class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
      </BaseButton>

      <BaseButton @click="purchaseOrderStore.changeStatusParams('received')" variant="ghost" size="sm"
        class="relative overflow-hidden group border border-gray-200 dark:border-gray-700 rounded-full px-6 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300"
        :class="{ 'bg-indigo-700 border-indigo-300 dark:border-indigo-700': purchaseOrderStore.params.status === 'received' }">
        <span class="relative z-10 flex items-center">
          <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          Received
        </span>
        <span
          class="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
      </BaseButton>

      <BaseButton @click="purchaseOrderStore.changeStatusParams('cancelled')" variant="ghost" size="sm"
        class="relative overflow-hidden group border border-gray-200 dark:border-gray-700 rounded-full px-6 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300"
        :class="{ 'bg-indigo-700 border-indigo-300 dark:border-indigo-700': purchaseOrderStore.params.status === 'cancelled' }">
        <span class="relative z-10 flex items-center">
          <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
          Cancelled
        </span>
        <span
          class="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
      </BaseButton>
    </div>

    <!-- HAPUS Date Range Filter yang ada di sini -->

    <!-- Futuristic Order List Section -->
    <BaseList :items="purchaseOrderStore.items" :loading="purchaseOrderStore.loading" empty-icon="PackageOpen"
      empty-title="Belum Ada Order"
      empty-description="Belum ada order pembelian yang tersedia. Klik tombol 'Tambah Order' untuk membuat order baru."
      @page-change="handlePageChange">
      <template #item="{ item }">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group hover:border-indigo-200 dark:hover:border-indigo-800">
          <div class="flex flex-col md:flex-row">
            <!-- Order Status Badge -->
            <div class="w-full md:w-1 h-1 md:h-auto" :class="{
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
                      <span>{{ formatDateIndo((item?.order_date)) }}</span>
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
                    Rp. {{ formatRupiahNumber(getTotal(item) || 0) }}
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
                  <span class="text-xs px-2 py-0.5 rounded-full" :class="{
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
                  <IconButton @click="viewPurchaseOrderDetail(item)" variant="primary" size="sm" title="Lihat Detail">
                    <template #icon>
                      <Icon name="Eye" />
                    </template>
                  </IconButton>
                  <IconButton v-if="item.status === 'draft'" @click="editPurchaseOrder(item)" variant="primary"
                    size="sm" title="Edit">
                    <template #icon>
                      <Icon name="Edit" />
                    </template>
                  </IconButton>
                  <IconButton @click="copyPurchaseOrder(item)" variant="primary" size="sm" title="Copy Order">
                    <template #icon>
                      <Icon name="Copy" />
                    </template>
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </BaseList>

    <BasePagination v-model:current-page="purchaseOrderStore.pagination.page"
      :total-items="purchaseOrderStore.pagination.totalItems"
      :items-per-page="purchaseOrderStore.pagination.itemsPerPage" @update:current-page="handlePageChange" />

    <div>
      <PurchaseOrderDetail v-model="showDetailDialog" :purchase-order-id="selectedPurchaseOrderId"
        :data-order="purchaseOrderStore.purchaseOrder" @status-updated="handleStatusUpdated" />
    </div>

    <div>
      <PurchaseOrderForm v-model="purchaseOrderStore.showCreateDialog" @success="handleFormSuccess"
        @close="handleFormClose" />
    </div>


  </BasePage>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { usePurchaseOrderStore } from '@/stores/transaksi/order_pembelian'
import { formatDateIndo } from '@/utils/dateHelper'
import { formatRupiahNumber } from '@/utils/uangHelper'
import PurchaseOrderForm from './PurchaseOrderForm.vue'
import PurchaseOrderDetail from './PurchaseOrderDetail.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BasePage from '@/components/ui/BasePage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseList from '@/components/ui/BaseList.vue'
import Icon from '@/components/ui/Icon.vue'
import BasePagination from '../../../../components/ui/BasePagination.vue'
import BaseDateRangeFilter from '@/components/ui/BaseDateRangeFilter.vue'
import IconButton from '@/components/ui/IconButton.vue'

const purchaseOrderStore = usePurchaseOrderStore()
const showDetailDialog = ref(false)
const selectedPurchaseOrderId = ref(null)

// State untuk date range dengan nilai default bulan ini
const dateRange = ref({
  start_date: getMonthStartDate(),
  end_date: getMonthEndDate()
})

// Fungsi untuk mendapatkan tanggal awal bulan ini
function getMonthStartDate() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
}

// Fungsi untuk mendapatkan tanggal akhir bulan ini
function getMonthEndDate() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
}

// Watch perubahan date range dan update params di store
watch(dateRange, (newRange) => {
  // Pastikan params ada sebelum mengakses propertinya
  if (!purchaseOrderStore.params) {
    purchaseOrderStore.params = {}
  }

  // Sekarang aman untuk mengatur properti
  purchaseOrderStore.params.start_date = newRange.start_date
  purchaseOrderStore.params.end_date = newRange.end_date
}, { deep: true })

// Handle perubahan date range
const handleDateRangeChange = () => {
  purchaseOrderStore.fetchPurchaseOrders()
}

// Fetch initial data dengan nilai default
onMounted(() => {
  // Set nilai default ke params store
  purchaseOrderStore.params.start_date = dateRange.value.start_date
  purchaseOrderStore.params.end_date = dateRange.value.end_date

  // Fetch data
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
const viewPurchaseOrderDetail = (item) => {
  const id = item.id
  purchaseOrderStore.purchaseOrder = item
  selectedPurchaseOrderId.value = id
  showDetailDialog.value = true
}

// Add edit function
const editPurchaseOrder = async (item) => {
  console.log('Edit button clicked for PO:', item);

  try {
    // Reset form terlebih dahulu
    console.log('Resetting form...');
    purchaseOrderStore.resetForm();
    purchaseOrderStore.purchaseOrder = item;

    // Langsung gunakan data item yang sudah ada
    purchaseOrderStore.form = {
      supplier_id: item.supplier_id,
      supplier: item?.supplier || null,
      date: item.date,
      due_date: item.due_date || '',
      status: item.status,
      items: item.items?.map(orderItem => ({
        product_id: orderItem.product_id,
        product: orderItem.product,
        quantity: orderItem.quantity,
        price: orderItem.price,
        total: orderItem.price * orderItem.quantity
      })) || [],
      notes: item.notes || ''
    };

    console.log('Setting form data from item...', purchaseOrderStore.form);
    // Pastikan supplier ada di daftar suppliers
    if (item.supplier && !purchaseOrderStore.suppliers.some(s => s.id === item.supplier.id)) {
      console.log('Adding supplier to suppliers list:', item.supplier);
      purchaseOrderStore.suppliers.push(item.supplier);
    }

    // Set mode edit
    // console.log('Setting edit mode...');
    purchaseOrderStore.setEditMode(item.id);

    // Tampilkan dialog
    // console.log('Showing create dialog...');
    purchaseOrderStore.showCreateDialog = true;

    // Log untuk debugging
    // console.log('Edit mode activated for PO ID:', item.id);
    // console.log('Supplier ID:', purchaseOrderStore.form.supplier_id);
    // console.log('Available suppliers:', purchaseOrderStore.suppliers);
    // console.log('Selected supplier:', item.supplier);
  } catch (error) {
    console.error('Error preparing purchase order for edit:', error);
  }
}

// Handle form cancel
const getTotal = (item) => {
  return item.items?.reduce((total, orderItem) => total + orderItem.price * orderItem.quantity, 0)
  purchaseOrderStore.showCreateDialog = false
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

// Tambahkan fungsi copyPurchaseOrder
const copyPurchaseOrder = async (item) => {
  try {
    // Reset form terlebih dahulu
    purchaseOrderStore.resetForm();

    // Salin data dari item yang dipilih, tapi tanpa id
    purchaseOrderStore.form = {
      supplier_id: item.supplier_id,
      supplier: item.supplier,
      date: new Date().toISOString().split('T')[0], // Gunakan tanggal hari ini
      due_date: item.due_date || '',
      status: 'draft', // Selalu set sebagai draft untuk order baru
      items: item.items?.map(orderItem => ({
        product_id: orderItem.product_id,
        product: orderItem.product,
        quantity: orderItem.quantity,
        price: orderItem.price,
        total: orderItem.price * orderItem.quantity
      })) || [],
      notes: item.notes || ''
    };

    // Pastikan supplier ada di daftar suppliers
    if (item.supplier && !purchaseOrderStore.suppliers.some(s => s.id === item.supplier.id)) {
      purchaseOrderStore.suppliers.push(item.supplier);
    }

    // Tampilkan dialog
    purchaseOrderStore.showCreateDialog = true;
  } catch (error) {
    console.error('Error copying purchase order:', error);
  }
}
</script>

<style scoped>
/* Tambahkan animasi hover untuk card */
.group:hover {
  transform: translateY(-2px);
}

/* Override untuk slot search di BasePage */
:deep(.max-w-md) {
  max-width: 100% !important;
}
</style>
