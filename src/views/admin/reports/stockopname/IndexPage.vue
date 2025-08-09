<template>
  <BasePage title="Laporan Stok Opname" subtitle="Laporan Stok Opname berdasarkan periode">

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
    <!-- <template #search>
      <div class="flex items-center justify-between gap-2 w-full no-print">
        <div class="relative rounded-full shadow-lg min-w-[300px]">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Icon name="Search" class="w-5 h-5 text-indigo-400" />
          </div>
          <BaseInput v-model="store.params.q" placeholder="Cari Transksi / Kasir .." type="text" clearable
            :debounce="500" @update:model-value="store.fetchData" />
        </div>
        <div class="flex-1 flex justify-end no-print">
          <BaseDateRangeFilter v-model="store.params" @change="store.fetchData" default-period="month" />
        </div>


      </div>
    </template> -->

    <div v-if="store.loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
    <!-- <div class="printable-area"> -->
    <DataTable v-if="!store.loading" ref="printRef" :data="store.items" :params="store.params" />
    <!-- </div> -->
    <BasePagination v-if="store.paginationInfo.totalItems > 0 && !store.loading"
      v-model:current-page="store.pagination.page" :total-items="store.paginationInfo.totalItems"
      :items-per-page="store.pagination.itemsPerPage" @update:current-page="store.handlePageChange" />

  </BasePage>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent, computed } from 'vue'
import { useStockOpnameStore } from '@/stores/reports/stockopname'
import { formatRupiah } from '@/utils/uangHelper'
import { printHtmlElement } from '@/utils/printing';

const DataTable = defineAsyncComponent(() => import('./DataTable.vue'))

const store = useStockOpnameStore()


const printRef = ref(null)


onMounted(() => {
  Promise.all([
    store.fetchData()
  ])
})

const handlePrint = () => {
  if (printRef.value) {
    printHtmlElement(printRef.value.$el);
  }
}
</script>
<style scoped></style>
