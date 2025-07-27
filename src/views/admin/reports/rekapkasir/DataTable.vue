<template>
  <div>
    <div v-if="data" class="relative w-full
        bg-white dark:bg-gray-900 text-black dark:text-white print:bg-white print:text-black
        p-4 printable-area
      ">

      <div class="">
        <div class="text-xl font-medium">{{ header.title }}</div>
        <!-- <div><strong>Periode:</strong> {{ formatDateIndo(params.start_date) }} - {{ formatDateIndo(params.end_date) }}
        </div> -->
        <div v-html="header.periode" />
      </div>


      <table class="w-full text-sm border-collapse" style="margin-top: 10px; margin-bottom: 10px;">
        <tbody>
          <!-- PENDAPATAN -->
          <tr class="bg-gray-100 dark:bg-gray-800 font-semibold">
            <td colspan="2" class="p-2 border">Pendapatan</td>
          </tr>
          <tr>
            <td class="p-2 border">Penjualan Tunai</td>
            <td class="p-2 border text-right">{{ formatRupiah(data.pendapatan.penjualan_tunai) }}</td>
          </tr>
          <tr>
            <td class="p-2 border">Penjualan Kredit</td>
            <td class="p-2 border text-right">{{ formatRupiah(data.pendapatan.penjualan_kredit) }}</td>
          </tr>
          <tr class="font-semibold">
            <td class="p-2 border">Total Penjualan</td>
            <td class="p-2 border text-right">{{ formatRupiah(data.pendapatan.total_penjualan) }}</td>
          </tr>
          <tr>
            <td class="p-2 border">Retur Penjualan</td>
            <td class="p-2 border text-right text-red-500"> {{ formatRupiah(data.pendapatan.retur_penjualan) }}</td>
          </tr>
          <tr class="font-bold bg-green-50 dark:bg-green-900">
            <td class="p-2 border">Pendapatan Bersih</td>
            <td class="p-2 border text-right text-green-600 dark:text-green-300">{{
              formatRupiah(data.pendapatan.pendapatan_bersih) }}</td>
          </tr>

          <!-- HPP -->
          <tr class="bg-gray-100 dark:bg-gray-800 font-semibold mt-4">
            <td colspan="2" class="p-2 border">Harga Pokok Penjualan</td>
          </tr>
          <tr>
            <td class="p-2 border">Total HPP</td>
            <td class="p-2 border text-right text-red-500"> {{ formatRupiah(data.hpp.hpp) }}</td>
          </tr>
          <tr class="font-bold bg-yellow-50 dark:bg-yellow-900">
            <td class="p-2 border">Laba Kotor</td>
            <td class="p-2 border text-right text-yellow-600 dark:text-yellow-300">{{ formatRupiah(data.hpp.laba_kotor)
              }}</td>
          </tr>

          <!-- Biaya Operasional -->
          <tr class="bg-gray-100 dark:bg-gray-800 font-semibold mt-4">
            <td colspan="2" class="p-2 border">Biaya Operasional</td>
          </tr>
          <tr>
            <td class="p-2 border">Total Biaya</td>
            <td class="p-2 border text-right text-red-500"> {{ formatRupiah(data.operasional.biaya_operasional) }}</td>
          </tr>

          <!-- LABA BERSIH -->
          <tr class="font-bold bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
            <td class="p-2 border">Laba Bersih</td>
            <td class="p-2 border text-right">{{ formatRupiah(data.laba_bersih) }}</td>
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
import { formatDateIndo } from '@/utils/dateHelper'
import { formatRupiah } from '@/utils/uangHelper'

const props = defineProps({
  data: {
    type: Object,
    default: null
  },
  params: {
    type: Object,
    default: null
  },
  header: {
    type: Object,
    default: null
  }

})

</script>

<style scoped>
@media print {
  .printable-area {
    color: black !important;
    background: white !important;
  }
}
</style>
