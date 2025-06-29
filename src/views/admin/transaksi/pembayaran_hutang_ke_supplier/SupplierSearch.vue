<template>
  <div class="">
    <SearchDropdown ref="searchRef" id="supplier-search" v-model="searchQuery" placeholder="Cari Invoice / Supplier..."
      :debounce="300" :min-search-length="2" item-key="id" item-label="name"
      not-found-text="Data Pembelian tidak ditemukan" not-found-subtext="Coba kata kunci lain" :show-add-button="false"
      api-url="/api/v1/pembayaran-hutang/search" api-response-path="data.data" :api-params="{ per_page: 10 }"
      :use-api="true" @select="handleSelected" @items-loaded="onItemsLoaded">
      <template #item="{ item }">
        <div class="flex justify-between text-sm">
          <div class="text-secondary-500 dark:text-secondary-400">
            <div><span>Reff : </span>{{ item.unique_code }}</div>
            <div><span>Nota : </span>{{ item.invoice_number || '-' }}</div>
            <div><span>Supplier : </span>{{ item.supplier_name || '-' }}</div>
          </div>
          <div class=" text-secondary-500 dark:text-primary-400">
            <div><span>Total : </span>Rp {{ formatRupiah(item?.total || 0) }}</div>
            <div><span>Total dibayar : </span>Rp {{ formatRupiah(item?.total_dibayar || 0) }}</div>
            <div><span>Saldo : </span>Rp {{ formatRupiah(item?.saldo || 0) }}</div>
          </div>
        </div>

      </template>
    </SearchDropdown>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatRupiah } from '@/utils/uangHelper'
const emit = defineEmits(['selected'])


const searchQuery = ref('')
const handleSelected = (item) => {
  console.log('Item selected:', item);
  emit('selected', item)
}

const onItemsLoaded = (items) => {
  console.log('Items loaded:', items);
}
// const keyword = ref('')

// const search = () => {
//   if (keyword.value.trim()) {
//     emit('selected', keyword.value.trim())
//   }
// }
</script>
