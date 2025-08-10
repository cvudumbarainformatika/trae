<template>
  <div class="space-y-4">
    <!-- <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
      <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
        <Icon name="Calculator" class="mr-2 text-primary-500" /> INFO PENJUALAN
      </h3>
      <div class="mb-2 space-y-1">
        <div
          class="flex items-center justify-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm ">
          <span class="font-mono text-2xl font-semibold text-primary-600 dark:text-primary-400 tracking-widest">{{
            formatCurrency(store.total) }}</span>
        </div>
        <div
          class="justify-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class=" text-xs text-primary-600 dark:text-primary-400 tracking-widest">[F1] Tab Penjualan Baru</div>
          <div class=" text-xs text-primary-600 dark:text-primary-400 tracking-widest">[F2] Pembayaran</div>
        </div>
      </div>
    </div> -->

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2">
      <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-4 flex items-center">
        <Icon name="Calculator" class="mr-2 text-primary-500" /> Riwayat Penjualan
      </h3>
      <div class="rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
        <ul class="">
          <li v-for="(item, idx) in store?.riwayats" :key="idx"
            class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 last:border-b-0  p-2">
            <div class="space-y-0.5">
              <div class="text-xs font-medium text-gray-800 dark:text-gray-100">
                {{ item?.customer_id ? 'PELANGGAN' : 'UMUM' }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDateIndo(item?.created_at) }} • {{ item?.payment_method?.toUpperCase() || '-' }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatTimeIndo(item?.created_at) }}
              </div>
            </div>

            <div class="text-right">
              <div class="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {{ formatRupiah(item?.total) }}
              </div>
            </div>
          </li>
        </ul>
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
  // console.log(value);

  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '-'
  return new Intl.NumberFormat('id-ID').format(value)
}
</script>
