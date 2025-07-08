<template>
  <BasePage :title="store.header.title" :subtitle="store.header.subtitle">

    <!-- <template #actions>
      <div class="flex items-center gap-2 no-print">
        <BaseButton @click="handlePrint" variant="primary" size="md"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] mr-2">
          <template #icon-left>
            <Icon name="Print" class="w-4 h-4 mr-2" />
          </template>
Cetak
</BaseButton>
</div>
</template> -->
    <template #search>
      <div class="flex items-center justify-between gap-2 w-full no-print">
        <!-- Search Input (dengan lebar yang cukup) -->
        <div class="relative rounded-full shadow-lg min-w-[300px]">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Icon name="Search" class="w-5 h-5 text-indigo-400" />
          </div>
          <BaseInput v-model="store.params.q" :placeholder="store.header.placeholderSearch" type="text" clearable
            :debounce="500" @update:model-value="store.fetchData" />
        </div>

        <!-- Filter Periode -->
        <!-- <div class="flex-1 flex justify-end no-print">
          <BaseDateRangeFilter v-model="store.params" @change="store.fetchData" default-period="month" />
        </div> -->


      </div>
    </template>


    <!-- <div class="printable-area"> -->
    <DataTable class="overflow-y-scroll" ref="printRef" :data="store.items" :params="store.params"
      :header="store.header" @detail="handleDetail" @update:modelValue="store.savePenyesuaian" />
    <!-- </div> -->
    <BasePagination v-if="store.paginationInfo.totalItems > 0" v-model:current-page="store.pagination.page"
      :total-items="store.paginationInfo.totalItems" :items-per-page="store.pagination.itemsPerPage"
      @update:current-page="store.handlePageChange" />


    <div v-if="store.showDetailDialog">
      <DialogKartuStock v-model="store.showDetailDialog" :data="store.detail" @close="handleClose" />
    </div>

  </BasePage>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useStockStore } from '@/stores/settings/stock'

const DataTable = defineAsyncComponent(() => import('./DataTable.vue'))
const DialogKartuStock = defineAsyncComponent(() => import('./DialogKartuStock.vue'))

const store = useStockStore()

onMounted(() => {
  Promise.all([
    store.fetchData(),
  ])
})

const handleDetail = (data) => {
  store.showDetailDialog = true
  store.detail = data
}

const handleClose = () => {
  store.params.page = 1
  store.params.per_page = 20
  store.showDetailDialog = false
  store.detail = null
}
</script>
