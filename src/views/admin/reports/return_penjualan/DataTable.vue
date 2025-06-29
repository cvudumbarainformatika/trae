<template>
  <div>
    <div v-if="data.length" class="relative w-full
        bg-white dark:bg-gray-900 text-black dark:text-white print:bg-white print:text-black
        p-4 printable-area
      ">

      <div class="">
        <div class="text-xl font-medium">{{ header.title }}</div>
        <!-- <div><strong>Periode:</strong> {{ formatDateIndo(params.start_date) }} - {{ formatDateIndo(params.end_date) }}
        </div> -->
        <div v-html="header.periode" />
      </div>

      <table class="min-w-full border border-gray-300 dark:border-gray-700 text-sm mt-2"
        style="margin-top: 10px; margin-bottom: 10px;">
        <thead class="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th class="text-left border p-3 ">Kode</th>
            <th class="text-left border p-3 ">Customer</th>
            <th class="text-center border p-3 ">Tanggal</th>
            <th class="text-right border p-3 ">Total</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in data" :key="item.id">

            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td class="border p-3  font-medium text-gray-800 dark:text-white">{{ item.unique_code }}</td>
              <td class="border p-3  text-gray-700 dark:text-gray-300">{{ item.customer_name || 'Umum' }}</td>
              <td class="border p-3  text-center text-gray-700 dark:text-gray-300">{{ formatDateIndo(item.created_at) }}
              </td>
              <td class="border p-3  text-right text-gray-700 dark:text-gray-300">{{ formatRupiah(item.total) }}</td>
            </tr>
            <tr v-if="item.items?.length">
              <td colspan="5" class="p-2 border bg-gray-50 dark:bg-gray-800">
                <ul class="list-disc ml-6 text-sm">
                  <li v-for="sub in item.items" :key="sub.id">
                    {{ sub.product_name }} - Qty: {{ formatRupiah(sub.qty) }} - Harga: {{ formatRupiah(sub.harga) }} -
                    Status: {{
                      sub.status }}
                  </li>
                </ul>
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
