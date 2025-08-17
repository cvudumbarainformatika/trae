<template>
  <BasePage :title="store.header.title" :subtitle="store.header.subtitle">


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


      </div>
    </template>


    <!-- <div class="printable-area"> -->
    <DataTable class="overflow-y-scroll" ref="printRef" :data="store.items" :params="store.params"
      :header="store.header" @detail="handleDetail" @update:modelValue="store.savePenyesuaian"
      @cancel="store.canceled" />
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
import { useStockGudangStore } from '@/stores/gudangs/penyesuaian'

const DataTable = defineAsyncComponent(() => import('./DataTable.vue'))
const DialogKartuStock = defineAsyncComponent(() => import('./DialogKartuStock.vue'))

const store = useStockGudangStore()

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
