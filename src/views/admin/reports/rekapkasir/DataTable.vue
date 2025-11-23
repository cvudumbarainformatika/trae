<template>
  <div>
    <div v-if="data" class="relative w-full bg-white dark:bg-gray-900 text-black dark:text-white print:bg-white print:text-black p-4 printable-area">
      <div class="">
        <div class="text-xl font-medium">{{ header.title }}</div>
        <div v-html="header.periode" />
      </div>
      <table class="w-full text-sm border-collapse" style="margin-top: 10px; margin-bottom: 10px;">
        <tbody>
          <!-- DEBET -->
          <tr class="bg-gray-100 dark:bg-gray-800 font-semibold">
            <td colspan="2" class="p-2 border">DEBET</td>
          </tr>
          
          <!-- Penjualan Section -->
          <tr class="font-semibold">
            <td colspan="2" class="p-2 border" style="padding-left: 1rem;">Penjualan</td>
          </tr>
          <tr>
            <td class="p-2 border"><span class="ml-8">- Penjualan Tunai</span></td>
            <td class="p-2 border text-right">{{ formatRupiah(data.penjualan?.penjualan_tunai || 0) }}</td>
          </tr>
          <tr>
            <td class="p-2 border"><span class="ml-8">- Penjualan Kredit</span></td>
            <td class="p-2 border text-right">{{ formatRupiah(data.penjualan?.penjualan_kredit || 0) }}</td>
          </tr>

          <!-- Penjualan per Kategori Section -->
          <template v-if="data.penjualan?.by_category">
            <tr class="font-semibold">
                <td colspan="2" class="p-2 border" style="padding-left: 1rem;">Penjualan per Kategori</td>
            </tr>
            <tr v-for="(amount, category) in data.penjualan.by_category" :key="category">
                <td class="p-2 border"><span class="ml-8">- {{ category }}</span></td>
                <td class="p-2 border text-right">{{ formatRupiah(amount) }}</td>
            </tr>
          </template>

          <!-- Pemasukan Lain -->
          <template v-if="data.operasional?.masuk?.items?.length">
             <tr class="font-semibold">
                <td colspan="2" class="p-2 border" style="padding-left: 1rem;">Pemasukan Lain</td>
            </tr>
            <tr v-for="d in data.operasional.masuk.items" :key="d.keterangan">
              <td class="p-2 border"><span class="ml-8">- {{ d?.keterangan }}</span></td>
              <td class="p-2 border text-right">{{ formatRupiah(d?.jumlah || 0) }}</td>
            </tr>
          </template>
          
          <tr class="font-bold bg-gray-50 dark:bg-gray-700">
            <td class="p-2 border">TOTAL DEBET</td>
            <td class="p-2 border text-right">{{ formatRupiah(data.operasional?.masuk?.total) }}</td>
          </tr>

          <!-- KREDIT -->
          <tr class="bg-gray-100 dark:bg-gray-800 font-semibold">
            <td colspan="2" class="p-2 border">KREDIT</td>
          </tr>
          <template v-if="data.operasional?.keluar?.items?.length">
            <tr v-for="d in data.operasional.keluar.items" :key="d.keterangan">
              <td class="p-2 border"><span class="ml-4">- {{ d?.keterangan }}</span></td>
              <td class="p-2 border text-right">{{ formatRupiah(d?.jumlah || 0) }}</td>
            </tr>
          </template>
          <tr class="font-bold bg-gray-50 dark:bg-gray-700">
            <td class="p-2 border">TOTAL KREDIT</td>
            <td class="p-2 border text-right">{{ formatRupiah(data.operasional?.keluar?.total) }}</td>
          </tr>

          <!-- TOTAL -->
          <tr class="font-extrabold bg-gray-200 dark:bg-gray-600">
            <td class="p-2 border">TOTAL REKAP</td>
            <td class="p-2 border text-right">{{ formatRupiah(data.total_semua || 0) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <NoData message="Belum Ada Data" description="Harap Cari Data Telebih Dahulu" icon="Package" />
    </div>
  </div>
</template>
<script setup>
import { formatDateIndo } from '@/utils/dateHelper'
import { formatRupiah } from '@/utils/uangHelper'
const props = defineProps({
  data: { type: Object, default: null },
  params: { type: Object, default: null },
  header: { type: Object, default: null }
})
</script>
<style scoped>
@media print { .printable-area { color: black !important; background: white !important; } }
</style>