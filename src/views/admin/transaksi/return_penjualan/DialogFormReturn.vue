<template>
  <BaseDialog title="Return Penjualan Baru" max-width="2xl" @close="closeDialog">

    <div
      class="h-full flex flex-col gap-6 p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">
      <!-- Main Content -->
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
        <!-- Kolom Kiri - Supplier (1/2 lebar) -->
        <div class="space-y-4">
          <InvoiceSearch @selected="loadSales" />
          <ReturnItemTable :items="storeForm.item?.items" :data="storeForm.item" :loading="storeForm.loading"
            @on-return="storeForm.simpanReturn" />
        </div>


      </div>
    </div>

  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue'

import InvoiceSearch from './InvoiceSearch.vue'
import ReturnItemTable from './ReturnItemTable.vue'
// import ReturnSummary from './ReturnSummary.vue'
import { useReturnPenjualanFormStore } from '@/stores/transaksi/return_penjualan/form'


const emit = defineEmits(['close'])

const storeForm = useReturnPenjualanFormStore()


const closeDialog = () => {
  emit('close')
}

const loadSales = async (item) => {
  // Simulasi: Fetch invoice dari backend
  // console.log('Loading invoice:', item);

  const nItem = {
    ...item,
    items: item.items.map(i => ({
      ...i,
      subtotal: i.price * i.qty,
      return_qty: 0,
      status: 'baik'
    }))
  }

  storeForm.item = nItem
}
</script>
