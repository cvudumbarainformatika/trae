<template>
  <div class="max-w-4xl mx-auto mt-10">
    <h1 class="text-2xl font-bold mb-6">Retur Pembelian</h1>
    <PurchaseSearch @searched="loadPurchase" />
    <ReturnPurchaseItemTable v-if="items.length" :items="items" />
    <ReturnPurchaseSummary v-if="items.length" :items="items" @submit="handleReturn" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PurchaseSearch from './PurchaseSearch.vue'
import ReturnPurchaseItemTable from './ReturnPurchaseItemTable.vue'
import ReturnPurchaseSummary from './ReturnPurchaseSummary.vue'

const items = ref([])

const loadPurchase = async (faktur) => {
  // Simulasi data dari faktur pembelian
  items.value = [
    { id: 1, nama: 'Besi Beton', qty: 50, harga: 45000, return_qty: 0, reason: '' },
    { id: 2, nama: 'Semen 50kg', qty: 20, harga: 75000, return_qty: 0, reason: '' }
  ]
}

const handleReturn = (returnedItems) => {
  console.log('Barang retur pembelian:', returnedItems)
  // Kirim ke backend
}
</script>
