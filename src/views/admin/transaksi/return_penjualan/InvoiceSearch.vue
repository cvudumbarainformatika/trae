<template>
  <div class="">
    <SearchDropdown ref="searchRef" id="product-search" v-model="searchQuery"
      placeholder="Cari Invoice / Barang untuk ditambahkan..." :debounce="300" :min-search-length="2" item-key="id"
      item-label="name" not-found-text="Data Penjualan tidak ditemukan" not-found-subtext="Coba kata kunci lain"
      :show-add-button="false" api-url="/api/v1/sales/search" api-response-path="data.data"
      :api-params="{ per_page: 10 }" :use-api="true" @select="handleSelected" @items-loaded="onItemsLoaded">
      <template #item="{ item }">
        <div class="flex justify-between text-sm">
          <div class="text-secondary-500 dark:text-secondary-400">
            <div><span>Nota : </span>{{ item.unique_code }}</div>
            <div><span>Customer : </span>{{ item.customer_name }}</div>
          </div>
          <div class=" text-secondary-500 dark:text-secondary-400">
            <div><span>Kasir : </span> {{ item.cashier_name }}</div>
            <div><span>Total : </span>Rp {{ item.total }}</div>
          </div>
        </div>
        <hr class="my-[8px] border-dashed border-gray-500" />
        <div v-for="(item, index) in item.items" :key="index">
          <div class="text-primary-600 dark:text-primary-400">
            <div>{{ item.product?.name }} x {{ item.qty }} = Rp {{ item.subtotal }}</div>
          </div>
        </div>
      </template>
    </SearchDropdown>

  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
const emit = defineEmits(['selected'])

const searchRef = ref(null)
const searchQuery = ref('')

const handleSelected = (item) => {
  console.log('Item selected:', item);
  emit('selected', item)
}

const onItemsLoaded = (items) => {
  console.log('Items loaded:', items);
}
</script>
