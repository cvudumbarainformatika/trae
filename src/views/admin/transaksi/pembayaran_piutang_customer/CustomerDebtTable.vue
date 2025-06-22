<template>
  <table class="w-full text-sm border mt-4">
    <thead class="bg-gray-100">
      <tr>
        <th class="px-4 py-2">No Invoice</th>
        <th class="px-4 py-2 text-center">Tanggal</th>
        <th class="px-4 py-2 text-right">Total</th>
        <th class="px-4 py-2 text-right">Terbayar</th>
        <th class="px-4 py-2 text-right">Sisa</th>
        <th class="px-4 py-2 text-right">Bayar Sekarang</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="inv in invoiceList" :key="inv.id" class="border-t">
        <td class="px-4 py-2">{{ inv.no_invoice }}</td>
        <td class="px-4 py-2 text-center">{{ inv.tanggal }}</td>
        <td class="px-4 py-2 text-right">{{ formatRupiah(inv.total) }}</td>
        <td class="px-4 py-2 text-right">{{ formatRupiah(inv.terbayar) }}</td>
        <td class="px-4 py-2 text-right text-red-600">{{ formatRupiah(inv.sisa) }}</td>
        <td class="px-4 py-2 text-right">
          <input type="number" v-model.number="inv.bayar" :max="inv.sisa" min="0"
            class="w-24 border px-2 py-1 rounded text-right" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({ invoiceList: Array })

const formatRupiah = (v) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(v)
</script>
