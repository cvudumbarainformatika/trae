<template>
  <BasePage title="Pembelian" subtitle="Kelola transaksi pembelian dari supplier">
    <template #actions>
      <BaseButton
        @click="router.push('/admin/transaksi/pembelian/create')"
        variant="primary"
        size="md"
        class="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px]"
      >
        <template #icon-left>
          <Icon name="Plus" class="w-4 h-4" />
        </template>
        Tambah Pembelian
      </BaseButton>
    </template>

    <!-- Search dan Filter Periode di luar BaseList -->
    <div class="flex items-center justify-between gap-2 w-full mb-4">
      <!-- Search Input (dengan lebar yang cukup) -->
      <div class="relative rounded-full shadow-lg w-3/4">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Icon name="Search" class="w-5 h-5 text-indigo-400" />
        </div>
        <BaseInput
          v-model="params.q"
          placeholder="Cari pembelian..."
          type="text"
          clearable
          :debounce="500"
          @update:model-value="fetchPurchases"
        />
      </div>
      <!-- Filter Periode -->
      <BaseDateRangeFilter
        v-model="dateRange"
        @change="handleDateRangeChange"
        default-period="month"
      />
    </div>
    <!-- Status Filter Buttons -->
    <div class="flex flex-wrap gap-2 mb-4 mt-2">
      <BaseButton
        variant="ghost"
        size="sm"
        class="relative overflow-hidden group border border-gray-200 dark:border-gray-700 rounded-full px-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
        :class="{ 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700': params.status === 'all' }"
        @click="params.status = 'semua'"
      >
        <span class="relative z-10">Semua</span>
        <span class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
      </BaseButton>
      <BaseButton
        @click="params.status = 'langsung'"
        variant="ghost"
        size="sm"
        class="relative overflow-hidden group border border-gray-200 dark:border-gray-700 rounded-full px-6 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all duration-300"
        :class="{ 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700': params.status === 'langsung' }"
      >
        <span class="relative z-10 flex items-center">
          <span class="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
          Pembelian Langsung
        </span>
        <span class="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
      </BaseButton>
      <BaseButton
        @click="params.status = 'order'"
        variant="ghost"
        size="sm"
        class="relative overflow-hidden group border border-gray-200 dark:border-gray-700 rounded-full px-6 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300"
        :class="{ 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700': params.status === 'completed' }"
      >
        <span class="relative z-10 flex items-center">
          <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          Dari Order
        </span>
        <span class="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
      </BaseButton>
    </div>

    <!-- Futuristic Purchase List Section -->
    <BaseList
      :items="purchases"
      :loading="loading"
      empty-icon="PackageOpen"
      empty-title="Belum Ada Pembelian"
      empty-description="Belum ada transaksi pembelian yang tersedia. Klik tombol 'Tambah Pembelian' untuk membuat transaksi baru."
    >
      <template #item="{ item }">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group hover:border-indigo-200 dark:hover:border-indigo-800">
          <div class="flex flex-col md:flex-row">
            <div class="w-full md:w-1 h-1 md:h-auto"
                 :class="{
                   'bg-green-500': item.purchase_order !== null,
                   'bg-yellow-500': item.status_order === null,
                 }">
            </div>
            <div class="flex-1 p-4">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-base font-medium text-gray-900 dark:text-white mb-1 flex items-center">
                    <Icon name="Building" class="w-4 h-4 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                    {{ item.supplier?.name || 'Supplier tidak diketahui' }}
                  </h3>
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
                <div class="text-right">
                  <div class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.total || 0) }}
                  </div>
                </div>
              </div>
              <div class="flex justify-between items-center mt-2">
                <div class="flex gap-x-4 items-center text-gray-500 dark:text-gray-400">
                  <div class="flex space-x-1 items-center">
                    <Icon name="Receipt" class="w-4 h-4" />
                    <div class="text-base">{{ item.invoice_number || `INV-${item.id}` }}</div>
                  </div>
                  <span class="text-xs px-2 py-0.5 rounded-full"
                      :class="{
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': item.purchase_order !== null,
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': item.purchase_order === null,
                      }">
                  {{ item.purchase_order ? 'Dari Order' : 'Pembelian Langsung' }}
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <IconButton
                    @click="showPurchaseDetail(item)"
                    variant="primary"
                    size="sm"
                    title="Lihat Detail"
                  >
                    <template #icon>
                      <Icon name="Eye" />
                    </template>
                  </IconButton>
                  <IconButton
                    v-if="item.status === 'pending'"
                    @click="completePurchase(item.id)"
                    variant="primary"
                    size="sm"
                    title="Selesaikan"
                  >
                    <template #icon>
                      <Icon name="CheckCircle" />
                    </template>
                  </IconButton>
                  <IconButton
                    v-if="item.status === 'pending'"
                    @click="cancelPurchase(item.id)"
                    variant="primary"
                    size="sm"
                    title="Batalkan"
                  >
                    <template #icon>
                      <Icon name="Trash" />
                    </template>
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </BaseList>
    <BasePagination v-model:current-page="pagination.page"
      :total-items="pagination.totalItems"
      :items-per-page="pagination.itemsPerPage"
      @update:current-page="handlePageChange"
    />
    <!-- Dialog Detail Pembelian -->
    <BaseDialog :title="`Detail Pembelian # ${selectedPurchase?.unique_code}`" v-model="showDetailDialog" max-width="4xl" @close="closeDetailDialog">
      <DialogPurchaseDetail v-if="selectedPurchase" :purchase="selectedPurchase" />
    </BaseDialog>
  </BasePage>
</template>

<script setup>
import { ref, onMounted, watch, computed, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import BasePage from '@/components/ui/BasePage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseList from '@/components/ui/BaseList.vue'
import Icon from '@/components/ui/Icon.vue'
import { api } from '@/services/api'
import {usePurchaseStore} from '@/stores/transaksi/pembelian'

const router = useRouter()

const DialogPurchaseDetail = defineAsyncComponent(() => import('./DialogPurchaseDetail.vue'))


const store = usePurchaseStore()
const { fetchPurchases, showPurchaseDetail, handlePageChange, closeDetailDialog } = store
const { purchases, pagination, params, loading, showDetailDialog, selectedPurchase } = storeToRefs(store)



// State untuk date range dengan nilai default bulan ini
const dateRange = ref({
  start_date: getMonthStartDate(),
  end_date: getMonthEndDate()
})

// Tambahkan definisi currentPage sebagai computed property yang mereferensikan pagination.page
const currentPage = computed({
  get: () => pagination.value.page,
  set: (value) => {
    pagination.value.page = value
  }
})




const handleDateRangeChange = () => {
  // purchaseOrderStore.fetchPurchaseOrders()
  console.log('Date range changed:', dateRange.value)
}

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

// Complete purchase
const completePurchase = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menyelesaikan transaksi ini?')) return

  try {
    await api.put(`/api/v1/purchases/${id}/complete`)
    fetchPurchases()
  } catch (error) {
    console.error('Error completing purchase:', error)
  }
}

// Cancel purchase
const cancelPurchase = async (id) => {
  if (!confirm('Apakah Anda yakin ingin membatalkan transaksi ini?')) return

  try {
    await api.put(`/api/v1/purchases/${id}/cancel`)
    fetchPurchases()
  } catch (error) {
    console.error('Error cancelling purchase:', error)
  }
}

// Watch for changes in filters or pagination
watch([currentPage, params], () => {
  fetchPurchases()
}, { deep: true })

// Watch perubahan date range dan update params di store
watch(dateRange, (newRange) => {
  params.value.start_date = newRange.start_date
  params.value.end_date = newRange.end_date
}, { deep: true })

// Lifecycle hooks
onMounted(() => {
  params.value.start_date = dateRange.value.start_date
  params.value.end_date = dateRange.value.end_date
  // fetchPurchases()
})
</script>

