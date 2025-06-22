<template>
  <div class="max-w-4xl mx-auto mt-10">
    <h1 class="text-2xl font-bold mb-6">Pembayaran Hutang ke Supplier</h1>
    <SupplierSearch @searched="loadFaktur" />
    <SupplierDebtTable v-if="fakturList.length" :fakturList="fakturList" />
    <PaymentSummary v-if="fakturList.length" :fakturList="fakturList" @submit="submitPembayaran" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SupplierSearch from './SupplierSearch.vue'
import SupplierDebtTable from './SupplierDebtTable.vue'
import PaymentSummary from './PaymentSummary.vue'

// Simulasi data
const fakturList = ref([])

const loadFaktur = (keyword) => {
  fakturList.value = [
    {
      id: 1,
      no_faktur: 'PB-001',
      tanggal: '2025-06-01',
      total: 500000,
      terbayar: 200000,
      sisa: 300000,
      bayar: 0
    },
    {
      id: 2,
      no_faktur: 'PB-002',
      tanggal: '2025-06-05',
      total: 750000,
      terbayar: 0,
      sisa: 750000,
      bayar: 0
    }
  ]
}

const submitPembayaran = (data) => {
  console.log('Data pembayaran:', data)
  // Kirim ke backend
}
</script>
