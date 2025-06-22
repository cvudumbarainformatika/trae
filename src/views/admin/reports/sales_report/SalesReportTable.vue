<template>
  <div class="overflow-auto">
    <table class="w-full text-sm border">
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="px-4 py-2">No Invoice</th>
          <th class="px-4 py-2">Tanggal</th>
          <th class="px-4 py-2">Customer</th>
          <th class="px-4 py-2 text-right">Total</th>
          <th class="px-4 py-2">Metode</th>
          <th class="px-4 py-2">Kasir</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trx in transaksi" :key="trx.id" class="border-t">
          <td class="px-4 py-2">{{ trx.no_invoice }}</td>
          <td class="px-4 py-2">{{ trx.tanggal }}</td>
          <td class="px-4 py-2">{{ trx.customer }}</td>
          <td class="px-4 py-2 text-right">{{ formatRupiah(trx.total) }}</td>
          <td class="px-4 py-2">{{ trx.metode }}</td>
          <td class="px-4 py-2">{{ trx.kasir }}</td>
        </tr>
      </tbody>
      <tfoot class="bg-gray-50 font-semibold">
        <tr>
          <td class="px-4 py-2 text-right" colspan="3">Total</td>
          <td class="px-4 py-2 text-right">
            {{ formatRupiah(total) }}
          </td>
          <td colspan="2"></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ transaksi: Array })

const total = computed(() =>
  props.transaksi.reduce((sum, t) => sum + t.total, 0)
)

const formatRupiah = (v) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(v)
</script>
