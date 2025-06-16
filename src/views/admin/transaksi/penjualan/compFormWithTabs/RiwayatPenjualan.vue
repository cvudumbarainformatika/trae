<template>
  <div class="space-y-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
      <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
        <Icon name="Calculator" class="mr-2 text-primary-500" /> TOTAL PENJUALAN
      </h3>
      <div class="mb-2">
        <div class="flex items-center justify-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
          <span class="font-mono text-2xl font-semibold text-primary-600 dark:text-primary-400 tracking-widest">{{ formatCurrency(store.total) }}</span>
        </div>
      </div>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
      <div class="text-sm font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
        <Icon name="Calculator" class="mr-2 text-primary-500" /> SHORTCUT PENJUALAN
      </div>
      <div class="mb-2">
        <div class="justify-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class=" text-xs text-primary-600 dark:text-primary-400 tracking-widest">[F1] Tab Penjualan Baru</div>
          <div class=" text-xs text-primary-600 dark:text-primary-400 tracking-widest">[F2] Pembayaran</div>
        </div>
      </div>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
      <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
        <Icon name="Calculator" class="mr-2 text-primary-500" /> Riwayat Penjualan
      </h3>
    </div>
  </div>
</template>

<script setup>
import { useSalesFormWitTabsStore } from '@/stores/transaksi/penjualan/formwithtabs';

const store = useSalesFormWitTabsStore()
function formatCurrency(value) {
  // console.log(value);

  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '-'
  return new Intl.NumberFormat('id-ID').format(value)
}
</script>
