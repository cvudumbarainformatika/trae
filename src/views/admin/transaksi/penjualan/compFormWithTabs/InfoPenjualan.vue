<template>
  <div class="space-y-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
      <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
        <Icon name="Calculator" class="mr-2 text-primary-500" /> INFO PENJUALAN
      </h3>

      <div class="mb-2 space-y-1">
        <div
          class="flex items-center justify-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm relative">
          <span class="font-mono text-2xl font-semibold text-primary-600 dark:text-primary-400 tracking-widest ">{{
            formatCurrency(store?.total) }}</span>

          <span class="absolute top-0 left-0 p-2 bg-gray-200 dark:bg-gray-800 text-xs">
            TOTAL
          </span>
        </div>
        <div
          class="flex items-center justify-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm relative">
          <span class="text-xl text-primary-600 dark:text-primary-100 tracking-widest">{{
            store?.isiTab?.items?.length }} Item </span>
          <span class="absolute top-0 left-0 p-2 bg-gray-200 dark:bg-gray-800 text-xs">
            JUMLAH
          </span>
        </div>
        <div
          class="justify-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
          <div class=" text-xs text-primary-600 dark:text-primary-400 tracking-widest">[F1] Tab Penjualan Baru</div>
          <div class=" text-xs text-primary-600 dark:text-primary-400 tracking-widest">[F2] Pembayaran</div>
          <div class=" text-xs text-primary-600 dark:text-primary-400 tracking-widest">[CTRL + 1] Penjualan Umum</div>
          <div class=" text-xs text-primary-600 dark:text-primary-400 tracking-widest">[CTRL + 2] Penjualan Member</div>
          <div class=" text-xs text-primary-600 dark:text-primary-400 tracking-widest">[CTRL + 3] Penjualan Antar</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSalesFormWitTabsStore } from '@/stores/transaksi/penjualan/formwithtabs';
import { formatDateIndo, formatTimeIndo } from '@/utils/dateHelper'
import { formatRupiah } from '@/utils/uangHelper'

const store = useSalesFormWitTabsStore()
function formatCurrency(value) {
  // console.log(store.isiTab);

  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '-'
  return new Intl.NumberFormat('id-ID').format(value)
}
</script>
