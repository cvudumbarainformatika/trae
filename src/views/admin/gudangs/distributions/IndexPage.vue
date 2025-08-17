<template>
  <BasePage title="Distribusi Produk" subtitle="Manage Distribusi Product ke Toko">
    <template #actions>
      <div class="flex items-center gap-2">
        <BaseButton @click="store.showCreateDialog = true" variant="primary" size="md"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] mr-2">
          <template #icon-left>
            <Icon name="Plus" class="w-4 h-4" />
          </template>
          Distribusi Produk
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
          <BaseInput v-model="store.params.q" placeholder="Cari return penjualan..." type="text" clearable
            :debounce="500" @update:model-value="store.fetchData" />
        </div>

        <!-- Filter Periode -->
        <div class="flex-1 flex justify-end">
          <BaseDateRangeFilter v-model="dateRange" @change="handleDateRangeChange" default-period="month" />
        </div>
      </div>
    </template>

    <DataTable :data="store.items" @detail="handleDetail" />
    <BasePagination v-if="store.paginationInfo.totalItems > 0" v-model:current-page="store.pagination.page"
      :total-items="store.paginationInfo.totalItems" :items-per-page="store.pagination.itemsPerPage"
      @update:current-page="store.handlePageChange" />

    <div v-if="store.showCreateDialog">
      <DialoForm v-model="store.showCreateDialog" @close="store.showCreateDialog = false" />
    </div>
    <div v-if="store.showDetailDialog">
      <DialogDetail v-model="store.showDetailDialog" :data="store.detail" @close="store.showDetailDialog = false" />
    </div>

    <!-- <div class="max-w-4xl mx-auto mt-10">

      <ReturnSummary v-if="items.length" :items="items" @submit="handleReturn" />
    </div> -->
  </BasePage>

</template>

<script setup>
import { ref, onMounted, watch, defineAsyncComponent } from 'vue'
import { getMonthStartDate, getMonthEndDate } from '@/utils/dateHelper'
import { useDistributionGudangStore } from '@/stores/gudangs/distributions'

const DataTable = defineAsyncComponent(() => import('./DataTable.vue'))
const DialoForm = defineAsyncComponent(() => import('./DialogForm.vue'))
const DialogDetail = defineAsyncComponent(() => import('./DialogDetail.vue'))






// const handleReturn = (returnedItems) => {
//   console.log('Data retur yang dikirim:', returnedItems)
//   // Kirim ke backend
// }

const store = useDistributionGudangStore()
const dateRange = ref({
  start_date: getMonthStartDate(),
  end_date: getMonthEndDate()
})

const handleDateRangeChange = () => {
  store.fetchData()
}

const handleDetail = (data) => {
  store.detail = data
  store.showDetailDialog = true
}

onMounted(() => {
  // Set nilai default ke params store
  store.params.start_date = dateRange.value.start_date
  store.params.end_date = dateRange.value.end_date

  // Fetch data
  store.fetchData()
})

watch(dateRange, (newRange) => {
  // Pastikan params ada sebelum mengakses propertinya
  if (!store.params) {
    store.params = {}
  }

  // Sekarang aman untuk mengatur properti
  store.params.start_date = newRange.start_date
  store.params.end_date = newRange.end_date
}, { deep: true })


</script>
