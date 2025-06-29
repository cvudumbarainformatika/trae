<template>
  <BaseDialog title="Pembayaran Hutang Baru" max-width="2xl" @close="closeDialog">

    <div
      class="h-full flex flex-col gap-6 p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">
      <!-- Main Content -->
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
        <!-- Kolom Kiri - Supplier (1/2 lebar) -->
        <div class="space-y-4">



          <SupplierSearch @selected="loadFaktur" />
          <SupplierDebtTable :items="storeForm.item?.phd" :data="storeForm.item" />
          <PaymentSummary v-if="storeForm.item?.phd?.length" :fakturList="storeForm.item?.phd"
            :loading="storeForm.loading" :data="storeForm.item" @submit="handleSubmit" />

        </div>


      </div>
    </div>

  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue'
// import ReturnSummary from './ReturnSummary.vue'
import { useBayarHutangFormStore } from '@/stores/transaksi/bayar_hutang/form'

import SupplierSearch from './SupplierSearch.vue'
import SupplierDebtTable from './SupplierDebtTable.vue'
import PaymentSummary from './PaymentSummary.vue'
// import ReturnPurchaseSummary from './ReturnPurchaseSummary.vue'

const emit = defineEmits(['close'])

const storeForm = useBayarHutangFormStore()

const loadFaktur = async (item) => {

  const total = parseFloat(item.total)
  const tanggal = item.created_at
  const dibayar = parseFloat(item.paid || 0)
  const faktur = item.unique_code

  // Sisa awal
  let sisa = total - dibayar

  // Entri pertama (dari item utama)
  const phdList = [{
    faktur,
    tanggal,
    total,
    dibayar,
    sisa
  }]

  // Zigzag ke bawah berdasarkan item.phd
  for (const i of item.phd) {
    const totalSekarang = sisa
    const dibayar = parseFloat(i.dibayar || 0)
    const sisaBaru = totalSekarang - dibayar

    phdList.push({
      ...i,
      total: totalSekarang,
      dibayar,
      sisa: sisaBaru,
      tanggal: i.created_at
    })

    // Update sisa untuk langkah berikutnya
    sisa = sisaBaru
  }

  const nItem = {
    ...item,
    phd: phdList
  }

  storeForm.item = nItem

  console.log('storeForm.item', storeForm.item);


}

const handleSubmit = (value) => {
  console.log('Bayar hutang:', value)
  // Kirim ke backend
  storeForm.simpanPembayaran(value)
}




const closeDialog = () => {
  storeForm.item = null
  emit('close')
}


</script>
