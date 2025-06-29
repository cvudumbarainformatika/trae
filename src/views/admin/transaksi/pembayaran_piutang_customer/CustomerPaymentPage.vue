<template>
  <BasePage title="Piutang dibayar" subtitle="Manage Piutang dibayar dari Customer">
    <template #actions>
      <div class="flex items-center gap-2">
        <BaseButton @click="store.showCreateDialog = true" variant="primary" size="md"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] mr-2">
          <template #icon-left>
            <Icon name="Plus" class="w-4 h-4" />
          </template>
          Piutang dibayar
        </BaseButton>
      </div>
    </template>
    <template #search>
      <div class="flex items-center justify-between gap-2 w-full">
        <!-- Search Input (dengan lebar yang cukup) -->
        <div class="relative rounded-full shadow-lg min-w-[300px]">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Icon name="Search" class="w-5 h-5 text-indigo-400" />
          </div>
          <BaseInput v-model="store.params.q" placeholder="Cari Transksi / Supplier..." type="text" clearable
            :debounce="500" @update:model-value="store.fetchData" />
        </div>

        <!-- Filter Periode -->
        <div class="flex-1 flex justify-end">
          <BaseDateRangeFilter v-model="store.dateRange" @change="store.fetchData" default-period="month" />
        </div>
      </div>
    </template>
    <DataTable :data="store.items" @detail="handleDetail" />
    <div v-if="store.showCreateDialog">
      <DialogForm v-model="store.showCreateDialog" @close="store.showCreateDialog = false" />
    </div>
    <div v-if="store.showDetailDialog">
      <DialogDetail v-model="store.showDetailDialog" :data="store.detail" @close="store.showCreateDialog = false" />
    </div>
  </BasePage>

  <!-- <div class="max-w-4xl mx-auto mt-10">
    <h1 class="text-2xl font-bold mb-6">Pembayaran Piutang Customer</h1>
    <CustomerSearch @searched="loadInvoice" />
    <CustomerDebtTable v-if="invoiceList.length" :invoiceList="invoiceList" />
    <CustomerPaymentSummary v-if="invoiceList.length" :invoiceList="invoiceList" @submit="submitPembayaran" />
  </div> -->
</template>

<script setup>
import { ref, defineAsyncComponent, onMounted, watch } from 'vue'
import { useBayarPiutangStore } from '@/stores/transaksi/bayar_piutang'


const DataTable = defineAsyncComponent(() => import('./DataTable.vue'))
const DialogForm = defineAsyncComponent(() => import('./DialogForm.vue'))
const DialogDetail = defineAsyncComponent(() => import('./DialogDetail.vue'))

const store = useBayarPiutangStore()
onMounted(() => {
  store.fetchData()
})

const handleDetail = (data) => {
  store.detail = data
  store.showDetailDialog = true
}

watch(store.dateRange, (newRange) => {
  // Pastikan params ada sebelum mengakses propertinya
  if (!store.params) {
    store.params = {}
  }

  // Sekarang aman untuk mengatur properti
  store.params.start_date = newRange.start_date
  store.params.end_date = newRange.end_date
  // store.fetchData()
}, { deep: true })


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
