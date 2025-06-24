<template>
  <BaseDialog title="Return Pembelian Baru" max-width="2xl" @close="closeDialog">

    <div
      class="h-full flex flex-col gap-6 p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">
      <!-- Main Content -->
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
        <!-- Kolom Kiri - Supplier (1/2 lebar) -->
        <div class="space-y-4">


          <PurchaseSearch @selected="loadPurchase" />
          <ReturnPurchaseItemTable :items="storeForm.item?.items" :data="storeForm.item" :loading="storeForm.loading"
            @on-return="handleReturn" />
          <!-- <ReturnPurchaseSummary v-if="storeForm.item?.items" :items="storeForm.item?.items" @submit="handleReturn" /> -->
          <!-- <InvoiceSearch @selected="loadSales" />
          <ReturnItemTable :items="storeForm.item?.items" :data="storeForm.item" :loading="storeForm.loading"
            @on-return="storeForm.simpanReturn" /> -->
        </div>


      </div>
    </div>

  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue'
// import ReturnSummary from './ReturnSummary.vue'
import { useReturnPembelianFormStore } from '@/stores/transaksi/return_pembelian/form'

import PurchaseSearch from './PurchaseSearch.vue'
import ReturnPurchaseItemTable from './ReturnPurchaseItemTable.vue'
// import ReturnPurchaseSummary from './ReturnPurchaseSummary.vue'


// const items = ref([])

const loadPurchase = async (item) => {
  // Simulasi data dari faktur pembelian
  // items.value = [
  //   { id: 1, nama: 'Besi Beton', qty: 50, harga: 45000, return_qty: 0, reason: '' },
  //   { id: 2, nama: 'Semen 50kg', qty: 20, harga: 75000, return_qty: 0, reason: '' }
  // ]

  const nItem = {
    ...item,
    items: item.items.map(i => ({
      ...i,
      return_qty: 0,
      alasan: ''
    }))
  }

  storeForm.item = nItem

}

const handleReturn = (returnedItems) => {
  // console.log('Barang retur pembelian:', returnedItems)
  // Kirim ke backend
  storeForm.simpanReturn(returnedItems)
}


const emit = defineEmits(['close'])

const storeForm = useReturnPembelianFormStore()


const closeDialog = () => {
  storeForm.item = null
  emit('close')
}


</script>
