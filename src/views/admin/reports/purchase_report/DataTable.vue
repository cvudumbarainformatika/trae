<template>
  <div>
    <div v-if="data.length" class="relative w-full
        bg-white dark:bg-gray-900 text-black dark:text-white print:bg-white print:text-black
        p-4 printable-area
      ">

      <div class="">
        <div class="text-xl font-medium">Laporan Pembelian</div>
        <div><strong>Periode:</strong> {{ formatDateIndo(params.start_date) }} - {{ formatDateIndo(params.end_date) }}
        </div>
      </div>

      <!-- <table class="min-w-full border border-gray-300 dark:border-gray-700 text-sm mt-2"
        style="margin-top: 10px; margin-bottom: 10px;">
        <thead class="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th class="text-left border p-3 ">Kode</th>
            <th class="text-left border p-3 ">Supplier</th>
            <th class="text-left border p-3 ">Petugas</th>
            <th class="text-right border p-3 ">Total</th>
            <th class="text-right border p-3 ">Dibayar</th>
            <th class="text-center border p-3 ">Metode</th>
            <th class="text-center border p-3 ">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td class="border p-3  font-medium text-gray-800 dark:text-white">{{ item.unique_code }}</td>
            <td class="border p-3  text-gray-700 dark:text-gray-300">{{ item.supplier_name }}</td>
            <td class="border p-3  text-gray-700 dark:text-gray-300">{{ item.user_name }}</td>
            <td class="border p-3  text-right text-gray-700 dark:text-gray-300">{{ formatRupiah(item.total) }}</td>
            <td class="border p-3  text-right text-gray-700 dark:text-gray-300">{{ formatRupiah(item.paid) }}</td>
            <td class="border p-3  text-center text-gray-700 dark:text-gray-300 capitalize">{{ item.payment_method }}
            </td>
            <td class="border p-3  text-center text-gray-700 dark:text-gray-300">{{ formatDateIndo(item.date) }}</td>
          </tr>
        </tbody>
      </table> -->

      <table class="min-w-full border border-gray-300 dark:border-gray-700 text-sm mt-4 mb-4">
        <thead class="bg-gray-100 dark:bg-gray-600">
          <tr>
            <th class="text-left border p-3">Kode</th>
            <th class="text-left border p-3">Supplier</th>
            <th class="text-left border p-3">Petugas</th>
            <th class="text-right border p-3">Dibayar</th>
            <th class="text-center border p-3">Metode</th>
            <th class="text-center border p-3">Tanggal</th>
            <th class="text-right border p-3">Total</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in data" :key="item.id">
            <!-- HEADER TRANSAKSI -->
            <tr class="bg-gray-50 dark:bg-gray-700 font-medium">
              <td class="border p-3">{{ item.unique_code }}</td>
              <td class="border p-3">{{ item.supplier_name }}</td>
              <td class="border p-3">{{ item.user_name }}</td>
              <td class="border p-3 text-right">{{ formatRupiah(item.paid) }}</td>
              <td class="border p-3 text-center capitalize">{{ item.payment_method }}</td>
              <td class="border p-3 text-center">{{ formatDateIndo(item.date) }}</td>
              <td class="border p-3 text-right">{{ formatRupiah(item.total) }}</td>
            </tr>

            <!-- RINCIAN ITEM -->
            <tr v-if="withDetails">
              <td colspan="7" class="p-0">
                <table class="w-full text-xs border-t border-b border-gray-200 dark:border-gray-600">
                  <thead class="bg-white dark:bg-gray-800">
                    <tr>
                      <th class="text-left px-3 py-2 border">Nama Produk</th>
                      <th class="text-center px-3 py-2 border">Qty</th>
                      <!-- <th class="text-center px-3 py-2 border">Satuan</th> -->
                      <th class="text-right px-3 py-2 border">Harga Beli</th>
                      <th class="text-right px-3 py-2 border">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in item.items" :key="product.id">
                      <td class="px-3 py-2 border">{{ product?.product?.name || '-' }}</td>
                      <td class="px-3 py-2 border text-center">{{ product.qty }}</td>
                      <!-- <td class="px-3 py-2 border text-center">{{ product.unit || '-' }}</td> -->
                      <td class="px-3 py-2 border text-right">{{ formatRupiah(product?.price) }}</td>
                      <td class="px-3 py-2 border text-right">{{ formatRupiah(product?.subtotal) }}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </template>
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
    type: Array,
    default: () => []
  },
  params: {
    type: Object,
    default: null
  },
  withDetails: {
    type: Boolean,
    default: false
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
