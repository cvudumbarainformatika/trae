<template>
  <div>
    <div v-if="data.length" class="relative w-full
        bg-white dark:bg-gray-900 text-black dark:text-white print:bg-white print:text-black
        p-4 printable-area
      ">

      <div class="">
        <div class="text-xl font-medium">Laporan Penjualan</div>
        <div><strong>Periode:</strong> {{ formatDateIndo(params.start_date) }} - {{ formatDateIndo(params.end_date) }}
        </div>
      </div>




      <table class="min-w-full border border-gray-300 dark:border-gray-700 text-sm mt-4" style="margin-top: 10px;">
        <thead class="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th class="border p-2">Kode</th>
            <th class="border p-2">Customer</th>
            <th class="border p-2">Kasir</th>
            <th class="border p-2 text-right">Total</th>
            <th class="border p-2 text-right">Bayar</th>
            <th class="border p-2 text-right">Kembali</th>
            <th class="border p-2">Status</th>
            <th class="border p-2">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id">
            <td class="border p-2">{{ item.unique_code }}</td>
            <td class="border p-2">{{ item.customer_name || '-' }}</td>
            <td class="border p-2">{{ item.cashier_name || '-' }}</td>
            <td class="border p-2 text-right">{{ formatRupiah(item.total) }}</td>
            <td class="border p-2 text-right">{{ formatRupiah(item.bayar) }}</td>
            <td class="border p-2 text-right">{{ formatRupiah(item.kembali) }}</td>
            <td class="border p-2">{{ item.payment_method }}</td>
            <td class="border p-2">{{ formatDateIndo(item.created_at) }}</td>
          </tr>
        </tbody>
      </table>


    </div>
    <div v-else>
      <NoData message="Belum Ada Data" description="Harap Cari Data Telebih Dahulu" icon="Package"
        action-label="Add Product" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDateIndo } from '@/utils/dateHelper'
import { formatRupiah } from '@/utils/uangHelper'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  params: {
    type: Object,
    default: null
  },
  summary: {
    type: Object,
    default: null
  }

})

const summaryBoxes = computed(() => {
  return [
    { label: 'Total Penjualan', value: props.summary?.total_penjualan },
    { label: 'Total Dibayar', value: props.summary?.total_dibayar },
    { label: 'Total Penjualan Kredit', value: props.summary?.total_credit },
    { label: 'Jumlah Transaksi', value: props.summary?.jumlah_transaksi },
  ]
})

</script>
