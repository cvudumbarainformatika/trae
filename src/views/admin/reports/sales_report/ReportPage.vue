<template>
  <BasePage title="Laporan Penjualan" subtitle="Laporan Penjualan berdasarkan periode dan pendukung lainnya">

    <template #actions>
      <div class="flex items-center gap-2 no-print">
        <BaseButton @click="handlePrint" variant="primary" size="md"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] mr-2">
          <template #icon-left>
            <Icon name="Print" class="w-4 h-4 mr-2" />
          </template>
          Cetak
        </BaseButton>
      </div>
    </template>
    <template #search>
      <div class="flex items-center justify-between gap-2 w-full no-print">
        <!-- Search Input (dengan lebar yang cukup) -->
        <div class="relative rounded-full shadow-lg max-w-[360px]">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Icon name="Search" class="w-5 h-5 text-indigo-400" />
          </div>
          <BaseInput v-model="store.params.q" placeholder="Cari Transksi / Kasir .." type="text" clearable
            :debounce="500" @update:model-value="() => {
              allFetchData()
            }" />
        </div>

        <!-- Filter Periode -->
        <div class="flex-1 flex no-print">
          <BaseSelect v-model="store.params.status" clearable :options="[
            { value: 'cash', label: 'Cash' },
            { value: 'qris', label: 'QRIS' },
            { value: 'credit', label: 'Kredit' },
          ]" @update:model-value="() => {
            allFetchData()
          }" />
        </div>
        <!-- Filter Periode -->
        <div class="flex-1 flex justify-end no-print">
          <BaseDateRangeFilter v-model="store.params" @change="() => {
            allFetchData()
          }" default-period="month" />
        </div>


      </div>
    </template>

    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="box in summaryBoxes" :key="box.label"
        class="bg-white dark:bg-gray-800 rounded-xl shadow p-2 flex flex-col justify-between">
        <div class="text-sm text-gray-500 dark:text-gray-400">{{ box?.label }}</div>
        <div class="text-lg font-bold text-gray-900 dark:text-white mt-1">{{ formatRupiah(box?.value) }}</div>
      </div>
    </div>

    <div v-if="store.loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
    <!-- <div class="printable-area"> -->
    <DataTable v-else class="printable-area" ref="printRef" :data="store.items" :params="store.params"
      :summary="store.summary" />
    <!-- </div> -->
    <BasePagination v-if="store.paginationInfo.totalItems > 0 && !store.loading"
      v-model:current-page="store.pagination.page" :total-items="store.paginationInfo.totalItems"
      :items-per-page="store.pagination.itemsPerPage" @update:current-page="store.handlePageChange" />

  </BasePage>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent, computed } from 'vue'
import { useReportPenjualanStore } from '@/stores/reports/penjualan'
import { formatRupiah } from '@/utils/uangHelper'
import { printHtmlElement } from '@/utils/printing';

const DataTable = defineAsyncComponent(() => import('./DataTable.vue'))

const store = useReportPenjualanStore()
const summaryBoxes = computed(() => {
  return [
    { label: 'Total Penjualan', value: store.summary?.total_penjualan },
    { label: 'Total Dibayar', value: store.summary?.total_dibayar },
    { label: 'Total Penjualan Kredit', value: store.summary?.total_credit },
    { label: 'Jumlah Transaksi', value: store.summary?.jumlah_transaksi },
  ]
})

const printRef = ref(null)


onMounted(() => {
  allFetchData()
})

function allFetchData() {
  Promise.all([
    store.fetchData(),
    store.fetchSummary()
  ])
}

const handlePrint = () => {
  if (printRef.value) {
    printHtmlElement(printRef.value.$el);
  }
}
</script>
<style scoped></style>
