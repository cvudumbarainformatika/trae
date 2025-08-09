<template>
  <BasePage title="Laporan Pembelian" subtitle="Laporan Pembelian berdasarkan periode dan pendukung lainnya">

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
        <div class="relative rounded-full shadow-lg min-w-[300px]">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Icon name="Search" class="w-5 h-5 text-indigo-400" />
          </div>
          <BaseInput v-model="store.params.q" placeholder="Cari Transksi / Admin .." type="text" clearable
            :debounce="500" @update:model-value="store.fetchData" />
        </div>

        <div>
          <button @click="withDetails = !withDetails"
            class="relative w-16 h-8 rounded-full transition-colors duration-300 flex items-center px-1 shadow-inner bg-indigo-600"
            aria-label="Toggle Mode">
            <div class="w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300"
              :class="withDetails ? 'translate-x-8' : 'translate-x-0'">
              <div class="absolute inset-0 flex items-center justify-center text-sm">
                <!-- <span v-if="!isDark">🌞</span> -->
                <span>🌙</span>
              </div>
            </div>
          </button>
        </div>

        <!-- Filter Periode -->
        <div class="flex-1 flex justify-end no-print">
          <BaseDateRangeFilter v-model="store.params" @change="store.fetchData" default-period="month" />
        </div>


      </div>
    </template>

    <div v-if="store.loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>

    <!-- <div v-else class="printable-area"> -->
    <DataTable v-else class="printable-area" ref="printRef" :data="store.items" :params="store.params"
      :with-details="withDetails" />
    <!-- </div> -->
    <BasePagination v-if="store.paginationInfo.totalItems > 0 && !store.loading"
      v-model:current-page="store.pagination.page" :total-items="store.paginationInfo.totalItems"
      :items-per-page="store.pagination.itemsPerPage" @update:current-page="store.handlePageChange" />


    <!-- <DataTable :data="store.items" @detail="store.showDetailDialog = true" />

    <div v-if="store.showCreateDialog">
      <DialogForm v-model="store.showCreateDialog" @close="store.showCreateDialog = false" />
    </div> -->

  </BasePage>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useReportPembelianStore } from '@/stores/reports/pembelian'
import { printHtmlElement } from '@/utils/printing';

const DataTable = defineAsyncComponent(() => import('./DataTable.vue'))

const store = useReportPembelianStore()
const printRef = ref(null)

const withDetails = ref(false)

onMounted(() => {
  Promise.all([
    store.fetchData(),
  ])
})

const handlePrint = () => {
  if (printRef.value) {
    printHtmlElement(printRef.value.$el);
  }
}
</script>
<style scoped>
@media print {
  body * {
    visibility: hidden;
  }

  .printable-area,
  .printable-area * {
    visibility: visible;
    color: black !important;
    background: white !important;
  }

  .printable-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

}
</style>
