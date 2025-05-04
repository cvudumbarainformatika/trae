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

    <!-- Futuristic Purchase List Section -->
    <BaseList
      :items="purchases"
      :loading="loading"
      :pagination="pagination"
      empty-icon="PackageOpen"
      empty-title="Belum Ada Pembelian"
      empty-description="Belum ada transaksi pembelian yang tersedia. Klik tombol 'Tambah Pembelian' untuk membuat transaksi baru."
      @page-change="handlePageChange"
    >
      <template #item="{ item }">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group hover:border-indigo-200 dark:hover:border-indigo-800">
          <div class="flex flex-col md:flex-row">
            <!-- Purchase Status Badge -->
            <div class="w-full md:w-1 h-1 md:h-auto"
                 :class="{
                   'bg-green-500': item.status === 'completed',
                   'bg-yellow-500': item.status === 'pending',
                   'bg-red-500': item.status === 'cancelled'
                 }">
            </div>

            <!-- Purchase Info -->
            <div class="p-4 flex-grow">
              <div class="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ item.invoice_number || `INV-${item.id}` }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ new Date(item.date).toLocaleDateString() }}
                  </p>
                </div>
                <div class="mt-2 md:mt-0">
                  <span class="px-2 py-1 rounded-full text-xs font-medium"
                        :class="{
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': item.status === 'completed',
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': item.status === 'pending',
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': item.status === 'cancelled'
                        }">
                    {{ item.status === 'completed' ? 'Selesai' :
                       item.status === 'pending' ? 'Pending' : 'Dibatalkan' }}
                  </span>
                </div>
              </div>

              <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Supplier</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ item.supplier?.name || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Total Item</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ item.items?.length || 0 }} item</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Total</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.total || 0) }}
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="mt-4 flex justify-end space-x-2">
                <button @click="viewPurchaseDetail(item.id)"
                        class="px-3 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                  <Icon name="Eye" class="w-3.5 h-3.5 inline-block mr-1" />
                  Detail
                </button>
                <button v-if="item.status === 'pending'"
                        @click="completePurchase(item.id)"
                        class="px-3 py-1 text-xs font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors">
                  <Icon name="CheckCircle" class="w-3.5 h-3.5 inline-block mr-1" />
                  Selesaikan
                </button>
                <button v-if="item.status === 'pending'"
                        @click="cancelPurchase(item.id)"
                        class="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                  <Icon name="Trash" class="w-3.5 h-3.5 inline-block mr-1" />
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </BaseList>
  </BasePage>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import BasePage from '@/components/ui/BasePage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseList from '@/components/ui/BaseList.vue'
import Icon from '@/components/ui/Icon.vue'
import { api } from '@/services/api'

const router = useRouter()
const purchases = ref([])
const loading = ref(false)
const pagination = ref({
  page: 1,
  itemsPerPage: 10,
  totalItems: 0
})

// Tambahkan definisi currentPage sebagai computed property yang mereferensikan pagination.page
const currentPage = computed({
  get: () => pagination.value.page,
  set: (value) => {
    pagination.value.page = value
  }
})

// Tambahkan definisi totalPages sebagai computed property
const totalPages = computed(() => {
  return Math.ceil(pagination.value.totalItems / pagination.value.itemsPerPage)
})

// Tambahkan definisi filters jika dibutuhkan
const filters = ref({
  search: '',
  status: 'all'
})

// Fetch initial data
onMounted(() => {
  fetchPurchases()
})

// Handle page change
const handlePageChange = (page) => {
  if (page < 1 || page > Math.ceil(pagination.value.totalItems / pagination.value.itemsPerPage)) {
    return
  }

  pagination.value.page = page
  fetchPurchases()
}

// Fetch purchases
const fetchPurchases = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/api/v1/purchases', {
      params: {
        page: pagination.value.page,
        search: filters.value.search,
        status: filters.value.status !== 'all' ? filters.value.status : undefined
      }
    })

    purchases.value = data?.data || []
    pagination.value.totalItems = data?.meta?.total || 0
  } catch (error) {
    console.error('Error fetching purchases:', error)
    purchases.value = []
  } finally {
    loading.value = false
  }
}

// View purchase detail
const viewPurchaseDetail = (id) => {
  router.push(`/transaksi/pembelian/${id}`)
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

const calculateTotal = (subtotal, tax, discount) => {
  return subtotal + tax - discount
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  if (page !== '...') {
    currentPage.value = page
  }
}

// Watch for changes in filters or pagination
watch([currentPage, filters], () => {
  fetchPurchases()
}, { deep: true })

// Lifecycle hooks
onMounted(() => {
  fetchPurchases()
})
</script>

