<template>
  <BasePage title="Penjualan" subtitle="Kelola transaksi penjualan ke customer">
    <template #actions>

      <BaseButton color="secondary"
        class="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] mr-2"
        @click="goToKasir">
        <template #icon-left>
          <Icon name="bolt" class="w-4 h-4 mr-2" />
        </template>
        Penjualan Cepat
      </BaseButton>
    </template>

    <div class="flex items-center justify-between gap-2 w-full mb-4">
      <div class="relative rounded-full shadow-lg min-w-[300px]">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Icon name="Search" class="w-5 h-5 text-indigo-400" />
        </div>
        <BaseInput v-model="params.q" placeholder="Cari penjualan..." type="text" clearable :debounce="500"
          @update:model-value="salesStore.fetchSales" />
      </div>
      <!-- Filter Periode, jika diperlukan -->
      <div class="flex-1 flex justify-end pr-2">
        <BaseDateRangeFilter v-model="dateRange" @change="handleDateRangeChange" default-period="month" />
      </div>
    </div>
    <div class="flex flex-wrap gap-2 mb-4 mt-2">
      <BaseButton :variant="params.status === 'semua' ? 'primary' : 'ghost'" size="sm"
        class="relative overflow-hidden group border border-gray-200 dark:border-gray-700 rounded-full px-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
        :class="{ 'bg-indigo-700 border-indigo-300 dark:border-indigo-700': params.status === 'semua' }"
        @click="params.status = 'semua'">
        <span class="relative z-10">Semua</span>
        <span
          class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
      </BaseButton>
      <BaseButton @click="params.status = 'cash'" :variant="params.status === 'cash' ? 'primary' : 'ghost'" size="sm"
        class="relative overflow-hidden group border border-gray-200 dark:border-gray-700 rounded-full px-6 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all duration-300"
        :class="{ 'bg-indigo-700 border-indigo-300 dark:border-indigo-700': params.status === 'cash' }">
        <span class="relative z-10 flex items-center">
          <span class="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
          Tunai
        </span>
        <span
          class="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
      </BaseButton>
      <BaseButton @click="params.status = 'credit'" :variant="params.status === 'credit' ? 'primary' : 'ghost'"
        size="sm"
        class="relative overflow-hidden group border border-gray-200 dark:border-gray-700 rounded-full px-6 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300"
        :class="{ 'bg-indigo-700 border-indigo-300 dark:border-indigo-700': params.status === 'credit' }">
        <span class="relative z-10 flex items-center">
          <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          Kredit
        </span>
        <span
          class="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
      </BaseButton>
    </div>
    <SalesTable :data="sales" @detail="handleDetail" />

    <BasePagination v-model:current-page="params.page" :total-items="salesStore.paginationInfo.totalItems"
      :items-per-page="salesStore.paginationInfo.itemsPerPage" @update:current-page="salesStore.handlePageChange" />

    <DialogDetail v-model="salesStore.showDetailDialog" :data="salesStore.detail"
      @close="salesStore.showDetailDialog = false" />

  </BasePage>
</template>

<script setup>
import { ref, onMounted, watch, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useSalesStore } from '@/stores/transaksi/penjualan/index'
import { useAuthStore } from '@/stores/auth'
import { toLocalDateString, getMonthStartDate, getMonthEndDate } from '@/utils/dateHelper'
// import SalesTable from './SalesTable.vue'
// import BaseButton from '@/components/ui/BaseButton.vue'
// import BaseInput from '@/components/ui/BaseInput.vue'
// import BasePage from '@/components/ui/BasePage.vue'
// import Icon from '@/components/ui/Icon.vue'
import { storeToRefs } from 'pinia'


const SalesTable = defineAsyncComponent(() => import('./SalesTable.vue'))
const DialogDetail = defineAsyncComponent(() => import('./compFormWithTabs/DialogDetail.vue'))

const router = useRouter()
const salesStore = useSalesStore()
const authStore = useAuthStore()
const { params, sales } = storeToRefs(salesStore)
// const params = ref({ q: '', status: 'semua' })

onMounted(() => {

  if (authStore.user?.role === 'cashier') {
    goToKasir()
  }


  salesStore.params.start_date = dateRange.value.start_date
  salesStore.params.end_date = dateRange.value.end_date

  salesStore.fetchSales()
})

const dateRange = ref({
  start_date: getMonthStartDate(),
  end_date: getMonthEndDate()
})

function goToKasir() {
  router.push({ path: '/admin/transaksi/penjualan/kasir' })
}

const handleDetail = (data) => {
  salesStore.detail = data
  salesStore.showDetailDialog = true
}

const handleDateRangeChange = () => {
  console.log('Date range changed:', dateRange.value)
}

// Fungsi untuk mendapatkan tanggal awal bulan ini
watch(dateRange, (newRange) => {
  salesStore.params.start_date = newRange.start_date
  salesStore.params.end_date = newRange.end_date
}, { deep: true })

watch(salesStore.params, () => {
  salesStore.fetchSales()

  // sales.value = salesStore.sales
}, { deep: true })

</script>
