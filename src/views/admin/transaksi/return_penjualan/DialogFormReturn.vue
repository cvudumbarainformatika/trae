<template>
  <BaseDialog title="Return Penjualan Baru" max-width="4xl" @close="closeDialog">

    <div
      class="h-full flex flex-col gap-6 p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">
      <!-- Main Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Kolom Kiri - Supplier (1/3 lebar) -->
        <div class="space-y-4">
          <InvoiceSearch @searched="loadInvoice" />
          <ReturnItemTable v-if="items.length" :items="items" />
        </div>

        <!-- Kolom Kanan - Items (2/3 lebar) -->
        <div class="">

          <InvoiceSearch @searched="loadInvoice" />
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
const emit = defineEmits(['close'])


// Simulasi data invoice
const items = ref([])

const closeDialog = () => {
  emit('close')
}

const loadInvoice = async (invoice) => {
  // Simulasi: Fetch invoice dari backend
  console.log('Loading invoice:', invoice);

  items.value = [
    { id: 1, nama: 'Produk A', qty: 3, return_qty: 0, harga: 50000 },
    { id: 2, nama: 'Produk B', qty: 2, return_qty: 0, harga: 75000 }
  ]
}
</script>
