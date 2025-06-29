<template>
  <BaseDialog title="Pembayaran Hutang Baru" max-width="2xl" @close="closeDialog">

    <div
      class="h-full flex flex-col gap-6 p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800">
      <!-- Main Content -->
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
        <!-- Kolom Kiri - Supplier (1/2 lebar) -->
        <div class="space-y-4">



          <CustomerSearch @searched="loadInvoice" />
          <CustomerDebtTable :items="storeForm.item?.ppd" :data="storeForm.item" />
          <CustomerPaymentSummary v-if="storeForm.item?.ppd?.length" :invoice-list="storeForm.item?.ppd"
            :loading="storeForm.loading" :data="storeForm.item" @submit="handleSubmit" />

        </div>


      </div>
    </div>

  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue'
// import ReturnSummary from './ReturnSummary.vue'
import { useBayarPiutangFormStore } from '@/stores/transaksi/bayar_piutang/form'

import CustomerSearch from './CustomerSearch.vue'
import CustomerDebtTable from './CustomerDebtTable.vue'
import CustomerPaymentSummary from './CustomerPaymentSummary.vue'


// import SupplierSearch from './SupplierSearch.vue'
// import SupplierDebtTable from './SupplierDebtTable.vue'
// import PaymentSummary from './PaymentSummary.vue'
// import ReturnPurchaseSummary from './ReturnPurchaseSummary.vue'

const emit = defineEmits(['close'])

const storeForm = useBayarPiutangFormStore()

const loadInvoice = async (item) => {

  const total = parseFloat(item.total)
  const tanggal = item.created_at
  const dibayar = parseFloat(item.paid || 0)
  const faktur = item.unique_code

  // Sisa awal
  let sisa = total - dibayar

  // Entri pertama (dari item utama)
  const ppdList = [{
    faktur,
    tanggal,
    total,
    dibayar,
    sisa
  }]

  // Zigzag ke bawah berdasarkan item.phd
  for (const i of item.ppd) {
    const totalSekarang = sisa
    const dibayar = parseFloat(i.dibayar || 0)
    const sisaBaru = totalSekarang - dibayar

    ppdList.push({
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
    ppd: ppdList
  }

  storeForm.item = nItem

  console.log('storeForm.item', storeForm.item);


}

const handleSubmit = (value) => {
  // console.log('Bayar piutang:', value)
  // Kirim ke backend
  storeForm.simpanPembayaran(value)
}




const closeDialog = () => {
  storeForm.item = null
  emit('close')
}


</script>
