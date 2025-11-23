<template>
  <div class="flex-1 overflow-auto relative">
    <div v-if="data.length" class="relative w-full bg-white dark:bg-gray-900 text-black dark:text-white print:bg-white print:text-black p-4 rounded-xl shadow-md printable-area">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Laporan Penjualan</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          <strong>Periode:</strong> {{ formatDateIndo(params.start_date) }} - {{ formatDateIndo(params.end_date) }}
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th class="p-3 text-left font-semibold text-gray-600 dark:text-gray-300 uppercase">Kode</th>
              <th class="p-3 text-left font-semibold text-gray-600 dark:text-gray-300 uppercase">Customer</th>
              <th class="p-3 text-left font-semibold text-gray-600 dark:text-gray-300 uppercase">Kategori</th>
              <th class="p-3 text-left font-semibold text-gray-600 dark:text-gray-300 uppercase">Kasir</th>
              <th class="p-3 text-right font-semibold text-gray-600 dark:text-gray-300 uppercase">Total</th>
              <th class="p-3 text-right font-semibold text-gray-600 dark:text-gray-300 uppercase">Bayar</th>
              <th class="p-3 text-right font-semibold text-gray-600 dark:text-gray-300 uppercase">Kembali</th>
              <th class="p-3 text-center font-semibold text-gray-600 dark:text-gray-300 uppercase">Status</th>
              <th class="p-3 text-left font-semibold text-gray-600 dark:text-gray-300 uppercase">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data" :key="item.id" class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="p-3 whitespace-nowrap font-mono text-gray-700 dark:text-gray-400">{{ item.unique_code }}</td>
              <td class="p-3 whitespace-nowrap font-medium text-gray-800 dark:text-white">{{ item.customer_name || '-' }}</td>
              <td class="p-3 whitespace-nowrap text-gray-600 dark:text-gray-400">{{ item.customer?.category || '-' }}</td>
              <td class="p-3 whitespace-nowrap text-gray-600 dark:text-gray-400">{{ item.cashier_name || '-' }}</td>
              <td class="p-3 text-right whitespace-nowrap font-semibold text-gray-800 dark:text-white">{{ formatRupiah(item.total) }}</td>
              <td class="p-3 text-right whitespace-nowrap">{{ formatRupiah(item.bayar) }}</td>
              <td class="p-3 text-right whitespace-nowrap">{{ formatRupiah(item.kembali) }}</td>
              <td class="p-3 text-center whitespace-nowrap">
                <span class="px-2.5 py-1 rounded-full text-xs font-medium" :class="statusBadge(item.payment_method)">
                  {{ item.payment_method }}
                </span>
              </td>
              <td class="p-3 whitespace-nowrap text-gray-600 dark:text-gray-400">{{ formatDateIndo(item.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
    <div v-else>
      <NoData message="Belum Ada Data" description="Harap Cari Data Telebih Dahulu" icon="Package" />
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

const statusBadge = (status) => {
  switch (status.toLowerCase()) {
    case 'cash':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
    case 'credit':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
    case 'qris':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}
</script>
