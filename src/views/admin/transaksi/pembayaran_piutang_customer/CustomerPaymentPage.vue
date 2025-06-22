<template>
  <div class="max-w-4xl mx-auto mt-10">
    <h1 class="text-2xl font-bold mb-6">Pembayaran Piutang Customer</h1>
    <CustomerSearch @searched="loadInvoice" />
    <CustomerDebtTable v-if="invoiceList.length" :invoiceList="invoiceList" />
    <CustomerPaymentSummary v-if="invoiceList.length" :invoiceList="invoiceList" @submit="submitPembayaran" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CustomerSearch from './CustomerSearch.vue'
import CustomerDebtTable from './CustomerDebtTable.vue'
import CustomerPaymentSummary from './CustomerPaymentSummary.vue'

const invoiceList = ref([])

const loadInvoice = (keyword) => {
  invoiceList.value = [
    {
      id: 1,
      no_invoice: 'INV-001',
      tanggal: '2025-06-01',
      total: 300000,
      terbayar: 100000,
      sisa: 200000,
      bayar: 0
    },
    {
      id: 2,
      no_invoice: 'INV-002',
      tanggal: '2025-06-10',
      total: 400000,
      terbayar: 0,
      sisa: 400000,
      bayar: 0
    }
  ]
}

const submitPembayaran = (data) => {
  console.log('Pembayaran piutang customer:', data)
  // Kirim ke backend Laravel
}
</script>

<style scoped></style>
