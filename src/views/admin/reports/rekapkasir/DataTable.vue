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
            <td colspan="2" class="p-2 border">DEBET</td>
          </tr>
          <tr class="bg-gray-100 dark:bg-gray-800 font-semibold">
            <td colspan="2" class="p-2 border">Penjualan</td>
          </tr>
          <tr>
            <td class="p-2 border"> <span class="ml-4">- Penjualan Tunai</span></td>
            <td class="p-2 border text-right">{{ formatRupiah(data?.penjualan?.penjualan_tunai || 0) }}
            </td>
          </tr>
          <!-- DEBET -->

          <template v-if="data?.operasional?.masuk?.items?.length">
            <tr v-for="d in data?.operasional?.masuk?.items">
              <td class="p-2 border"> <span class="ml-4">- {{ d?.keterangan }}</span></td>
              <td class="p-2 border text-right">{{ formatRupiah(d?.jumlah || 0) }}
              </td>
            </tr>
            <tr class="font-semibold">
              <td class="p-2 border">TOTAL DEBET</td>
              <td class="p-2 border text-right">{{ formatRupiah(data?.operasional?.masuk?.total) }}</td>
            </tr>
          </template>
          <template v-else>

            <tr class="font-semibold">
              <td class="p-2 border">TOTAL DEBET</td>
              <td class="p-2 border text-right">0</td>
            </tr>
          </template>

          <!-- KREDIT -->
          <tr class="bg-gray-100 dark:bg-gray-800 font-semibold">
            <td colspan="2" class="p-2 border">KREDIT</td>
          </tr>
          <template v-if="data?.operasional?.keluar?.items?.length">
            <tr v-for="d in data?.operasional?.keluar?.items">
              <td class="p-2 border"> <span class="ml-4">- {{ d?.keterangan }}</span></td>
              <td class="p-2 border text-right">{{ formatRupiah(d?.jumlah || 0) }}
              </td>
            </tr>
            <tr class="font-semibold">
              <td class="p-2 border">TOTAL KREDIT</td>
              <td class="p-2 border text-right">{{ formatRupiah(data?.operasional?.keluar?.total) }}</td>
            </tr>
          </template>
          <template v-else>

            <tr class="font-semibold">
              <td class="p-2 border">TOTAL KREDIT</td>
              <td class="p-2 border text-right">0</td>
            </tr>
          </template>
          <!-- TOTAL -->
          <tr class="font-semibold">
            <td class="p-2 border">TOTAL REKAP</td>
            <td class="p-2 border text-right">{{ formatRupiah(data?.total_semua || 0) }}</td>
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


function summary(data) {
  return data?.reduce((sum, item) => sum + parseFloat(item.jumlah), 0)
}

</script>

<style scoped>
@media print {
  .printable-area {
    color: black !important;
    background: white !important;
  }
}
</style>
